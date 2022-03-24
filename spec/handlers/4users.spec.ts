import jwt, { Secret } from 'jsonwebtoken';
import supertest from 'supertest';
import client from '../../src/database';
import app from '../../src/server';

const request = supertest(app);


describe('Test endpoint responses', () => {
  beforeAll(async () => {
    // Reset table users before testing the order spec
    const conn = await client.connect();
    await conn.query("TRUNCATE users RESTART IDENTITY CASCADE;");
  });


  const user = {
    id: 1,
    firstname: 'testUser',
    lastname: 'lastname',
    password: 'UshallnotPASS'
  };

  const secret = (process.env.TOKEN_SECRET as unknown) as Secret;
  const spareToken = jwt.sign({user: user}, secret);


  it('signup() expects 200', async () => {
    const response = await request.post('/users')
    .send({
      firstname: 'testUser',
      lastname: 'lastname',
      password: 'UshallnotPASS'
    });
    expect(response.status).toBe(200);
  });

  
  it('signin() expects 200', async () => {
    const response = await request.post('/users/login')
    .send({
      firstname: 'testUser',
      password: 'UshallnotPASS'
    })
    // console.log('token ' + response.headers['authorization'].split(' ')[1]);
    expect(response.status).toBe(200);
  });


  it('index() returns one user with 200', async () => {
    const response = await request.get('/users')
    .set('Authorization', `Bearer ${spareToken}`);
    // console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{
      id: 1,
      firstname: 'testUser',
      lastname: 'lastname'
    }]);
  });


  it('get() returns a user with 200', async () => {
    const response = await request.get('/users/1')
    .set('Authorization', `Bearer ${spareToken}`);
    // console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      firstname: 'testUser',
      lastname: 'lastname'
    });
  });
});





