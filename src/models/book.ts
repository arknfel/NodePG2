import { QueryResult } from 'pg';
import client from '../database';

// export const bookPath = path.join(__dirname, __filename);

export type Book = {
  id?: number;
  title: string;
  total_pages: number;
  author: string;
  summary: string;
};


export class BookStore {

  // GET all books
  async index(): Promise<(Book)[]> {
    try {
      const conn = await client.connect();
      
      const sql = "SELECT * FROM books;";
      
      const result = await conn.query(sql);
      conn.release();
      return result.rows;

    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  // GET book by id
  async get(id: string): Promise<Book> {
    try {
      const conn = await client.connect();
      
      const sql = "SELECT * FROM books \
        WHERE id=($1);";
      
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];

    } catch (err) {
      throw err;
    }
  };

  // CREATE book
  async create(book: Book): Promise<Book> {
    try {
      const conn = await client.connect();
      
      const sql = "INSERT INTO books (title, total_pages,\
        author, summary) VALUES ($1, $2, $3, $4) RETURNING*;";
      
      const result = await conn.query(sql, Object.values(book));
      conn.release();
      return result.rows[0];

    } catch (err) {
      throw err;
    }
  };

  async update(id: string, updates: Object): Promise <Book> {
    try {
      const conn = await client.connect();
      
      const queryParts = Object.keys(updates)
        .map((element, index) => {
          return `${element}=($${index + 2})`
        }).join(', ');
      
      const sql = `UPDATE books SET ${queryParts} \
        WHERE id=($1) RETURNING*;`;

      const result = await conn.query(
        sql,
        [id, ...Object.values(updates)]
      );
      conn.release();
      return result.rows[0];

    } catch (err) {
      throw err
    }
  };

  // DELETE book by id
  async delete(id: string): Promise <Book> {
    try {
      const conn = await client.connect();
      
      const sql = "DELETE FROM books \
        WHERE id=($1) RETURNING*;";
      
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];

    } catch (err) {
      throw err;
    }
  };
}
