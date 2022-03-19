import client from "../database";


export type Order = {
  id?: number,
  user_id: number,
  status: string
};

export type OrderProductsEntry = {
  quantity: string,
  order_id: string,
  product_id: string  
};


export class OrderStore {
  async index(): Promise <(Order)[]> {
    try {
      const sql = 'SELECT * from orders';
      const conn = await client.connect();
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`unable to get orders: ${err}`);
    }
  };

  async get(user_id: string): Promise <Order> {
    try {

      const sql = 'SELECT * from orders WHERE user_id=($1)';
      const conn = await client.connect();
      const result = await conn.query(sql, [user_id]);
      conn.release();
      return result.rows[0];

    } catch (err) {
      throw new Error(`unable to get order: ${err}`);
    }
  };


  async create(order: Order): Promise<Order> {
    try {
      const sql = 'INSERT INTO orders (user_id, status) \
        VALUES ($1, \'active\') RETURNING *;';

      const conn = await client.connect();
      const result = await conn.query(sql, [order.user_id]);
      conn.release();
      return result.rows[0];

    } catch (err) {
      throw new Error(`unable to create order: ${err}`);
    }
  };

  async addProduct(orderProductEntry: OrderProductsEntry): Promise<Order> {
    try {
      const sql = 'INSERT INTO order_products (\
        quantity, order_id, product_id) VALUES \
        ($1, $2, $3) RETURNING *;';
      
      const conn = await client.connect();

      const result = await conn.query(sql, [
        orderProductEntry.quantity,
        orderProductEntry.order_id,
        orderProductEntry.product_id
      ]);
      conn.release();
      return result.rows[0];

    } catch (err) {
      throw new Error(`${err}`);
    }
  };
}