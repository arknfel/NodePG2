import client from '../database';
import bcrypt from 'bcrypt';
import { PoolClient, QueryResult } from 'pg';
import { connAvail } from './utils';


const pepper = process.env.BCRYPT_PW;
const saltRounds = (process.env.SALT_R as unknown) as string;

export type User = {
  id?: number|string;
  firstname: string;
  lastname: string;
  password: string;
};

export type UserEntry = {
  id?: number|string;
  firstname?: string;
  lastname?: string;
  password?: string;
};

export class UserStore {

  async index(): Promise <(User)[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT id, firstname, lastname from users;';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`unable to get users: ${err}`);
    }
  };

  async get(user_id: string, currentConn?: PoolClient): Promise<UserEntry> {
    try {
      const conn = await connAvail(currentConn, client);
      const sql = 'SELECT * FROM users WHERE id=($1);';
      const result: QueryResult<User> = await conn.query(sql, [user_id]);
      conn.release();
      const user = result.rows[0]
      return {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname
      }
    } catch (err) {
      throw `unable to get user: ${err}`;
    }
  }

  async create(user: User): Promise<UserEntry|null> {
    try {

      const conn = await client.connect()
      const userExists = await this.userExists(user.firstname, conn);

      if (userExists.length > 0) { return null }

      const sql = 'INSERT INTO users (firstname, \
        lastname, password) \
        VALUES ($1, $2, $3) RETURNING *;';
      
      const hash = bcrypt.hashSync(
        user.password + pepper,
        parseInt(saltRounds)
      );

      const result = await conn.query(
        sql,
        [user.firstname, user.lastname, hash]
      );
      conn.release();
      return {
        id: result.rows[0].id,
        firstname: result.rows[0].firstname,
        lastname: result.rows[0].lastname
      };

    } catch (err) {
      throw new Error(`Unable to create user:\n\t${err}`);
    }
  };

  async userExists (firstname: string, conn: PoolClient): Promise<(User)[]> {
    const sql = 'SELECT * FROM users \
      WHERE firstname=($1);';
    const result = await conn.query(sql, [firstname]);
    return result.rows;
  };

  async authenticate(
    firstname: string, password: string
  ): Promise<UserEntry|null> {

    const conn = await client.connect();
    const result = await this.userExists(firstname, conn);
    conn.release();

    if ( result.length > 0 ) {
      let user = result[0]; 

      if (bcrypt.compareSync(password + pepper, user.password)) {
        return {id: user.id, firstname: user.firstname};
      }
    }
    return null
  };
}