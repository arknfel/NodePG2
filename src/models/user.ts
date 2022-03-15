import client from '../database';
import bcrypt from 'bcrypt';

const pepper = process.env.BCRYPT_PW;
const saltRounds = (process.env.SALT_R as unknown) as string;

export type User = {
  id?: number;
  username: string;
  email_address: string;
  password: string;
};

export class UserStore {
  async create(user: User): Promise<User> {
    try {
      const conn = await client.connect()

      const sql = 'INSERT INTO users (username, \
        email_address, password_digest) \
        VALUES ($1, $2, $3) RETURNING*;';
      
      const hash = bcrypt.hashSync(
        user.password + pepper,
        parseInt(saltRounds)
      );
  
      const result = await conn.query(
        sql,
        [user.username, user.email_address, hash]
      );
      conn.release();
      return result.rows[0];

    } catch (err) {
      throw err;
    }
  };


  async authenticate(
    username: string,
    password: string
  ): Promise<User | null> {
    const conn = await client.connect();
    const sql = 'SELECT password_digest FROM users \
      WHERE username=($1);';
    
    const result = await conn.query(sql, [username]);

    console.log(password + pepper);

    if ( result.rows.length > 0 ) {
      const user = result.rows[0];
      console.log(user);

      if (bcrypt.compareSync(password + pepper, user.password_digest)) {
        return user;
      }
    }
    return null
  };
}