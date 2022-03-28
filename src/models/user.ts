import client from '../database';
import bcrypt from 'bcrypt';
import { PoolClient, QueryResult } from 'pg';
import { connAvail } from './utils';


const pepper = process.env.BCRYPT_PW;
const saltRounds = (process.env.SALT_R as unknown) as string;

export type User = {
  id?: number|string;
  username: string;
  firstname: string;
  lastname: string;
  password: string;
  isadmin?: boolean;
};

export type UserEntry = {
  id?: number|string;
  username?: string;
  firstname?: string;
  lastname?: string;
  password?: string;
  isadmin?: boolean;
};

export class UserStore {

  async index(): Promise <(User)[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT id, username, firstname, lastname, isAdmin from users;';
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
      const sql = 'SELECT id, username, firstname, lastname FROM users WHERE id=($1);';
      const result: QueryResult<User> = await conn.query(sql, [user_id]);
      conn.release();
      return result.rows[0];

    } catch (err) {
      throw `unable to get user: ${err}`;
    }
  }

  async create(user: User): Promise<UserEntry|null> {
    try {

      const conn = await client.connect()
      const userExists = await this.userExists(user.username, conn);

      if (userExists) { return null }

      const sql = "INSERT INTO users (username, firstname, \
        lastname, password, isAdmin) VALUES ($1, $2, $3, $4, '0') RETURNING *;";
      
      const hash = bcrypt.hashSync(
        user.password + pepper,
        parseInt(saltRounds)
      );

      const result = await conn.query(
        sql,
        [user.username, user.firstname, user.lastname, hash]
      );
      conn.release();
      return {
        id: result.rows[0].id,
        username: result.rows[0].username,
        firstname: result.rows[0].firstname,
        lastname: result.rows[0].lastname
      };

    } catch (err) {
      throw new Error(`Unable to create user:\n\t${err}`);
    }
  };

  async userExists (username: string, conn: PoolClient): Promise<UserEntry> {
    const sql = 'SELECT * FROM users \
      WHERE username=($1);';
    
    try {
      const result = await conn.query(sql, [username]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to check user:\n\t${err}`);
    }
  };

  async authenticate(
    username: string, password: string
  ): Promise<UserEntry|null> {

    try {
      const conn = await client.connect();
      const user = await this.userExists(username, conn);
      conn.release();

      if (user) { 

        if (bcrypt.compareSync(password + pepper, user.password as string)) {
          return {id: user.id, username: user.username, isadmin: user.isadmin};
        }
      }

      return null
    } catch (err) {
      throw new Error(`Unable to auth user:\n\t${err}`);
    }
  };
}