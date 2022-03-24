import jwt, { Secret } from 'jsonwebtoken';
import supertest from 'supertest';
import { Order, OrderStore } from '../../src/models/order';
import client from '../../src/database';
import app from '../../src/server';


const request = supertest(app);

describe('Orders Handler, all endpoints require a valid user-token', () => {
  beforeAll(async () => {
    // Reset table users before testing the order spec
    const conn = await client.connect();
    await conn.query("TRUNCATE users RESTART IDENTITY CASCADE;");

    // creating a user and a product to satisfy foriegn-key constrains 
    await conn.query("INSERT INTO users (firstname, lastname, password) \
      VALUES ('testUser', 'lastname', 'UshallnotPASS');")

    await conn.query("INSERT INTO products (name, price) \
      VALUES ('testProduct01', 42.42);");
    
    await conn.query("INSERT INTO products (name, price) \
    VALUES ('testProduct02', 10);");
    conn.release();
  });


  const user = {
    id: 1,
    firstname: 'testUser',
    lastname: 'lastname',
    password: 'UshallnotPASS'
  };

  const secret = (process.env.TOKEN_SECRET as unknown) as Secret;
  const spareToken = jwt.sign({
    user: {
      id: user.id,
      firstname: user.firstname
    }
  }, secret);


  // CREATE
  it('create order, expect 200 and order obj', async () => {
    // create first order
    await request.post('/users/1/orders')
    .set('Authorization', `Bearer ${spareToken}`)

    // create second order
    const response = await request.post('/users/1/orders')
    .set('Authorization', `Bearer ${spareToken}`)
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 2,
      user_id: '1',
      status: 'active'
    });
  });


  // INDEX
  it('index, expect 200 and list of active orders', async () => {
    const response = await request.get('/users/1/orders')
    .set('Authorization', `Bearer ${spareToken}`);
    
    expect(response.status).toBe(200);
    
    // order-senstive
    expect(response.body).toEqual(
      [
        {id: 1, user_id: '1', status: 'active'},
        {id: 2, user_id: '1', status: 'active'}
      ]
    );
  });


  // SHOW
  it('checkOrder, expect 200 and order obj', async () => {
    const response = await request.get('/users/1/orders/1')
    .set('Authorization', `Bearer ${spareToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      user_id: '1',
      status: 'active'
    });
  });


  //
  it('addProduct, expect 200 and order_product obj', async () => {
    await request.post('/users/1/orders/1/products')
    .set('Authorization', `Bearer ${spareToken}`)
    .send({
      quantity: '3',
      product_id: '1'
    })

    const response = await request.post('/users/1/orders/1/products')
    .set('Authorization', `Bearer ${spareToken}`)
    .send({
      quantity: '5',
      product_id: '2'
    })

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      quantity: 5,
      order_id: '1',
      product_id: '2'
    });
  });


  it('closeOrder, expect 200 and closed order obj', async () => {
    const response = await request.put('/users/1/orders/1/close')
    .set('Authorization', `Bearer ${spareToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      user_id: '1',
      status: 'complete'
    });
  });


  it('show complete orders, expect 200 and closed order obj', async () => {
    const response = await request.get('/users/1/orders/complete')
    .set('Authorization', `Bearer ${spareToken}`);
    // console.log(Object.entries(response.body));

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{id: 1, user_id: '1', status: 'complete'}]);
  });


  it('getOrderDetails, expect 200 and order details obj', async () => {
    const response = await request.get('/users/1/orders/1/details')
    .set('Authorization', `Bearer ${spareToken}`);
    console.log(response.body);

    expect(response.status).toBe(200);
    // expect(response.body).toEqual([{id: 1, user_id: '1', status: 'complete'}]);
  });

});
