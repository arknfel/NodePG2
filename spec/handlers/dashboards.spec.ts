import supertest from 'supertest';
import client from '../../src/database';
import app from '../../src/server';


const request = supertest(app)

describe('Dashboards Handler', () => {
  beforeAll(async () => {
    // Reset all tables before testing
    const conn = await client.connect();
    await conn.query("TRUNCATE users RESTART IDENTITY CASCADE;");
    await conn.query("TRUNCATE orders RESTART IDENTITY CASCADE;");
    await conn.query("TRUNCATE products RESTART IDENTITY CASCADE;");

    // creating a mock user to satisfy foriegn-key constrains 
    await conn.query("INSERT INTO users (username, firstname, lastname, password, isAdmin) \
      VALUES ('testUser', '__', '__', 'UshallnotPASS', '0');");

    // creating a mock order
    await conn.query("INSERT INTO orders (user_id, status) \
      VALUES (1, 'complete')");

    // creating 6 products
    await conn.query("INSERT INTO products (name, price) \
      VALUES ('testProduct01', 42.42); \
      INSERT INTO products (name, price) \
      VALUES ('testProduct02', 10); \
      INSERT INTO products (name, price) \
      VALUES ('testProduct03', 5.50); \
      INSERT INTO products (name, price) \
      VALUES ('testProduct04', 100); \
      INSERT INTO products (name, price) \
      VALUES ('testProduct05', 2022.25); \
      INSERT INTO products (name, price) \
      VALUES ('testProduct06', 99);");

    // creating 6 add-product actions
    await conn.query("INSERT INTO order_products \
      (quantity, order_id, product_id) \
      VALUES (2, 1, 1); \
      INSERT INTO order_products \
      (quantity, order_id, product_id) \
      VALUES (3, 1, 2); \
      INSERT INTO order_products \
      (quantity, order_id, product_id) \
      VALUES (4, 1, 3); \
      INSERT INTO order_products \
      (quantity, order_id, product_id) \
      VALUES (5, 1, 4); \
      INSERT INTO order_products \
      (quantity, order_id, product_id) \
      VALUES (6, 1, 5); \
      INSERT INTO order_products \
      (quantity, order_id, product_id) \
      VALUES (1, 1, 6);");

    conn.release();
  }); // BEFORE ALL ends

  it('topFiveSellers return top 5 sellers in terms of quantity', async () => {
    const response = await request.get('/reports/top-five-sellers');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { name: 'testProduct05', price: '$2,022.25' },
      { name: 'testProduct04', price: '$100.00' },
      { name: 'testProduct03', price: '$5.50' },
      { name: 'testProduct02', price: '$10.00' },
      { name: 'testProduct01', price: '$42.42' }
    ]);
  });

});