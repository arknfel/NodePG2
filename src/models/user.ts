import client from '../database';
import bcrypt from 'bcrypt';
import { PoolClient } from 'pg';

const pepper = process.env.BCRYPT_PW;
const saltRounds = (process.env.SALT_R as unknown) as string;

export type User = {
  id?: string|number;
  firstname: string;
  lastname: string;
  password: string;
};

export type UserEntry = {
  id?: string|number;
  firstname?: string;
  lastname?: string;
  password?: string;
};

export class UserStore {

  async index(): Promise <(User)[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * from users;';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`unable to get users: ${err}`);
    }
  };

  async get(user_id: string): Promise<UserEntry> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM users WHERE id=($1);';
      const result = await conn.query(sql, [user_id]);
      conn.release();
      const user = result.rows[0]
      return {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname
      }
    } catch (err) {
      throw err;
    }
  }

  async create(user: User): Promise<User|null> {
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
      return result.rows[0];

    } catch (err) {
      throw err;
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

    if ( result.length > 0 ) {
      let user = result[0]; 

      if (bcrypt.compareSync(password + pepper, user.password)) {
        return {id: user.id, firstname: user.firstname};
      }
    }
    return null
  };
}