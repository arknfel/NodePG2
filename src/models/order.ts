import { PoolClient } from "pg";
import client from "../database";
import { connAvail } from "./utils";


export type Order = {
  id?: string,
  user_id: string|number,
  status: string
};

export type OrderEntry = {
  user_id?: string|number,
  status?: string
};

export type OrderProduct = {
  quantity: string,
  order_id: string,
  product_id: string  
};


export class OrderStore {
  async index(): Promise<(Order)[]> {
    try {
      const sql = 'SELECT * from orders';
      const conn = await client.connect();
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`unable to get orders:\n${err}`);
    }
  };


  async get(user_id: string): Promise<(Order)[]> {
    try {

      const sql = 'SELECT * from orders WHERE user_id=($1)';
      const conn = await client.connect();
      const result = await conn.query(sql, [user_id]);
      conn.release();
      return result.rows;

    } catch (err) {
      throw new Error(`unable to get order:\n${err}`);
    }
  };


  async create(order: OrderEntry): Promise<Order> {
    try {
      const sql = 'INSERT INTO orders (user_id, status) \
        VALUES ($1, \'active\') RETURNING *;';

      const conn = await client.connect();
      const result = await conn.query(sql, [order.user_id]);
      conn.release();
      return result.rows[0];

    } catch (err) {
      throw new Error(`unable to create order:\n${err}`);
    }
  };


  async checkOrderStatus(
    order_id: string,
    currentConn?: PoolClient
  ): Promise<Order> {
    try {
      const sql = 'SELECT * FROM orders \
        WHERE id=($1);';

      const conn = await connAvail(currentConn, client);

      const result = await conn.query(sql, [order_id]);
      if (!currentConn) { conn.release }
      return result.rows[0];

    } catch (err) {
      throw new Error(`Unable to check order status:\n${err}`);
    }
  };


  async addProduct(
    order_id: string,
    quantity: string,
    product_id: string
  ): Promise<Order> {
    try {
      const sql = 'INSERT INTO order_products (\
        quantity, order_id, product_id) VALUES \
        ($1, $2, $3) RETURNING *;';

      const conn = await client.connect();
      
      // check order status
      const order = await this.checkOrderStatus(
        order_id,
        conn
      );

      if (order.status == 'complete') {
        conn.release();
        throw new Error(`order ${order_id} is already closed`);
      }

      const result = await conn.query(sql, [
        quantity,
        order_id,
        product_id
      ]);
      conn.release();
      return result.rows[0];

    } catch (err) {
      throw new Error(`Unable to add product:\n\t${err}`);
    }
  };


  async closeOrder(order_id: string, currentConn?: PoolClient) {
    try {

      // Initiate a stand-alone db conn
      // if none are available.
      const conn = await connAvail(currentConn, client);

      // check if order is alread closed/complete
      // before commiting an update 
      const order = await this.checkOrderStatus(order_id, conn);

      if (order.status == 'complete') {
        throw new Error(`order ${order_id} is already closed`);
      }

      const sql = 'UPDATE orders SET status=\'complete\' \
      WHERE id=($1) RETURNING *;';

      const result = await conn.query(sql, [order_id]);
      return result.rows[0];

    } catch (err) {
      throw new Error(`Unable to close order ${order_id}: \n\t${err}`);
    }
  };

  async getProducts(order_id: string, currentConn?: PoolClient) {
    const sql = 'SELECT p.name as name, SUM(op.quantity) AS quantity \
      , p.price AS price, SUM(p.price*op.quantity) AS cost \
      FROM products p JOIN order_products op ON p.id=op.product_id \
      WHERE op.order_id=($1) \
      group by p.id, p.name, p.price;';

    try {
      // Initiate a stand-alone db conn
      // if none are available.
      const conn = await connAvail(currentConn, client);
      const result = await conn.query(sql, [order_id])
      return result.rows;
 
    } catch (err) {
      throw new Error(`Unable to get products of ${order_id}: \n\t${err}`);
    }
  };


} // class OrderStore ends

