import client from "../database";


export type Product = {
  id?: number|string,
  name: string,
  price: string
};

export type ProductEntry = {
  name?: string,
  price?: string
};


export class ProductStore {

  async index(): Promise <(Product)[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * from products;';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`unable to get products: ${err}`);
    }
  };

  async get(product_id: string): Promise <Product> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * from products WHERE id=($1);';
      const result = await conn.query(sql, [product_id]);
      conn.release();
      return result.rows[0];

    } catch (err) {
      throw new Error(`unable to get product: ${err}`);
    }
  };


  async create(product: Product): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql = 'INSERT INTO products (name, price) \
        VALUES ($1, $2) RETURNING *;';

      const result = await conn.query(sql, [product.name, product.price]);
      conn.release();
      return result.rows[0];

    } catch (err) {
      console.log(err);
      throw new Error(`unable to create product: ${err}`);
    }
  };


  async update(product_id: number|string, updates: ProductEntry): Promise<Product> {
    try {
      const conn = await client.connect();

      // append val of property to vals
      // while forming query parts
      const vals: (string)[] = [];
      const queryParts = Object.entries(updates)
      .map((pair, index) => {
        vals.push(pair[1]);
        return `${pair[0]}=($${index+2})`;
      });

      const sql = `UPDATE products SET ${queryParts} \
        WHERE id=($1) RETURNING *;`;

      const result = await conn.query(sql, [product_id, ...vals]);
      conn.release();
      return result.rows[0];

    } catch (err) {
      throw new Error(`unable to update product: ${err}`);
    }
  };

  // async delete(id: string): Promise <Product> {
  //   try {
  //     const conn = await client.connect();
  //     const sql = 'DELETE from products WHERE id=($1);';
  //     const result = await conn.query(sql, [id]);
  //     conn.release();
  //     return result.rows[0];

  //   } catch (err) {
  //     throw new Error(`unable to delete product: ${err}`);
  //   }
  // };

};




