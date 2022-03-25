import jwt, { Secret } from 'jsonwebtoken';
import supertest from 'supertest';
import client from '../../src/database';
import app from '../../src/server';


const request = supertest(app);

describe('Products Handler, creat/update a product requires a valid user-token', () => {
  beforeAll(async () => {
    // Reset all tables before testing
    const conn = await client.connect();
    await conn.query("TRUNCATE users RESTART IDENTITY CASCADE;");
    await conn.query("TRUNCATE orders RESTART IDENTITY CASCADE;");
    await conn.query("TRUNCATE products RESTART IDENTITY CASCADE;");

    // creating a user and a product to satisfy foriegn-key constrains 
    await conn.query("INSERT INTO users (username, firstname, lastname, password, isAdmin) \
      VALUES ('testUser', '__', '__', 'UshallnotPASS', '0');");

    // await conn.query("INSERT INTO products (name, price) \
    //   VALUES ('testProduct01', 42.42);");
    
    // await conn.query("INSERT INTO products (name, price) \
    // VALUES ('testProduct02', 10);");
    conn.release();
  }); // BEFORE ALL ends


  const user = {
    id: 1,
    firstname: 'testUser',
    lastname: '__',
    password: '__',
    isadmin: false
  };

  const secret = (process.env.TOKEN_SECRET as unknown) as Secret;
  const mockToken = jwt.sign({
    user: {
      id: user.id,
      firstname: user.firstname
    }
  }, secret);

  // isadmin property is added to mock the admin token
  const adminMockToken = jwt.sign({
    user: {
      id: user.id,
      firstname: user.firstname,
      isadmin: true
    }
  }, secret);


  it('create, expect 200, product obj', async () => {
    // create first order
    const response = await request.post('/products')
    .set('Authorization', `Bearer ${adminMockToken}`)
    .send({
      name: 'testProduct01',
      price: '42.42'
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      name: 'testProduct01',
      price: '$42.42'
    });
  });



  it('index, expect a list of product objs', async () => {
    // create first order
    const response = await request.get('/products')
    .set('Authorization', `Bearer ${adminMockToken}`)

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{
      id: 1,
      name: 'testProduct01',
      price: '$42.42'
    }]);
  });


  it('Update, expect 200, updated order objs', async () => {
    // create first order
    const response = await request.put('/products/1')
    .set('Authorization', `Bearer ${adminMockToken}`)
    .send({
      name: 'testProduct01',
      price: '42.42'
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      name: 'testProduct01',
      price: '$42.42'
    });
  });

});