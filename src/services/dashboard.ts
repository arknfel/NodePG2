// import { PoolClient } from 'pg';
import client from '../database'
import { Product } from '../models/product';
// import { connAvail } from '../models/utils';



export class DashboardQueries {
  
  // Get top five seller products
  async topFiveSellers(): Promise<(Product)[]> {
    try {
      const conn = await client.connect();

      const sql = 'WITH temp_result AS \
      (SELECT p.*, sum(quantity) as Q FROM \
      products p JOIN order_products op ON p.id=op.product_id \
      GROUP BY p.id ORDER BY Q DESC LIMIT 5) \
      SELECT name, price FROM temp_result;';

      const result = await conn.query(sql);
      conn.release();
      return result.rows;
  
    } catch (err) {
      throw new Error(`unable to generate trends report: ${err}`);
    }
  };


  // // Get total costs per products of an order 
  // async orderCosts(order_id: string|number, currentConn?: PoolClient) {
  //   const sql = 'SELECT p.name as name, SUM(op.quantity) AS quantity \
  //     , p.price AS price, SUM(p.price*op.quantity) AS cost \
  //     FROM products p JOIN order_products op ON p.id=op.product_id \
  //     WHERE op.order_id=($1) \
  //     group by p.id, p.name, p.price;';

  //   try {
  //     // Initiate a stand-alone db conn
  //     // if none are available.
  //     const conn = await connAvail(currentConn, client);
  //     const result = await conn.query(sql, [order_id])
  //     conn.release();
  //     return result.rows;
 
  //   } catch (err) {
  //     throw new Error(`Unable to get products of ${order_id}: \n\t${err}`);
  //   }
  // };

}