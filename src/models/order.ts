import { PoolClient } from "pg";
import client from "../database";
import { connAvail } from "./utils";


export type Order = {
  id?: number|string,
  user_id: number|string,
  status?: string
};

export type OrderEntry = {
  id?: number|string
  user_id?: number|string,
  status?: string
};

export type OrderProduct = {
  quantity: number|string,
  order_id: number|string,
  product_id: number|string  
};


export class OrderStore {

  // async index(): Promise<(Order)[]> {
  //   try {
  //     const sql = 'SELECT * from orders';
  //     const conn = await client.connect();
  //     const result = await conn.query(sql);
  //     conn.release();
  //     return result.rows;
  //   } catch (err) {
  //     throw new Error(`unable to get orders:\n${err}`);
  //   }
  // };


  async getOrder(order_id: number|string, user_id: number|string): Promise<Order> {
    try {
      const sql = `SELECT * from orders WHERE id=($1) \
        AND user_id=($2);`;
      const conn = await client.connect();
      const result = await conn.query(sql, [order_id, user_id]);
      conn.release();
      return result.rows[0];

    } catch (err) {
      throw new Error(`unable to get order:\n${err}`);
    }
  };


  async completedOrders(user_id: number|string): Promise<(Order)[]> {
    try {
      const sql = `SELECT * from orders WHERE user_id=($1) \
        AND status='complete';`;
      const conn = await client.connect();
      const result = await conn.query(sql, [user_id]);
      conn.release();
      return result.rows;

    } catch (err) {
      throw new Error(`unable to get order:\n${err}`);
    }
  };


  async create(order: Order): Promise<OrderEntry> {
    try {
      const sql = 'INSERT INTO orders (user_id, status) \
        VALUES ($1, $2) RETURNING *;';

      const conn = await client.connect();
      const result = await conn.query(sql, [order.user_id, order.status]);
      conn.release();
      // const createdOrder: Order = {
      //   id: result.rows[0].id,
      //   user_id: result.rows[0].user_id,
      //   status: result.rows[0].status
      // } 
      return result.rows[0];
      // return {
      //   id: result.rows[0].id,
      //   user_id: result.rows[0].user_id,
      //   status: result.rows[0].status
      // };

    } catch (err) {
      throw new Error(`unable to create order:\n${err}`);
    }
  };


  async checkOrderStatus(
    order_id: string|number,
    currentConn?: PoolClient
  ): Promise<Order> {
    try {
      const sql = 'SELECT * FROM orders \
        WHERE id=($1);';

      const conn = await connAvail(currentConn, client);

      const result = await conn.query(sql, [order_id]);
      if (!currentConn) { conn.release(); }
      // conn.release();
      return result.rows[0];

    } catch (err) {
      throw new Error(`Unable to check order status:\n${err}`);
    }
  };


  async addProduct(
    order_id: number|string,
    quantity: number|string,
    product_id: number|string
  ): Promise<OrderProduct> {
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
        throw new Error(`order ${order_id} is already complete`);
      }

      const result = await conn.query(sql, [quantity, order_id, product_id]);
      conn.release();
      return result.rows[0];

    } catch (err) {
      throw new Error(`Unable to add product:\n\t${err}`);
    }
  };


  async closeOrder(order_id: string|number, currentConn?: PoolClient) {
    try {

      // Initiate a stand-alone db conn
      // if none are available.
      const conn = await connAvail(currentConn, client);

      // check if order is alread closed/complete
      // before commiting an update 
      let order = await this.checkOrderStatus(order_id, conn);

      if (order.status == 'complete') {
        throw new Error(`order ${order_id} is already closed`);
      }

      const sql = 'UPDATE orders SET status=\'complete\' \
      WHERE id=($1) RETURNING *;';

      const result = await conn.query(sql, [order_id]);
      conn.release();
      return result.rows[0];

    } catch (err) {
      throw new Error(`Unable to close order ${order_id}: \n\t${err}`);
    }
  };

  async getProducts(order_id: string|number, currentConn?: PoolClient) {
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
      conn.release();
      return result.rows;
 
    } catch (err) {
      throw new Error(`Unable to get products of ${order_id}: \n\t${err}`);
    }
  };


} // class OrderStore ends

