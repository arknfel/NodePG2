import jwt, { Secret } from 'jsonwebtoken';
import supertest from 'supertest';
import client from '../../src/database';
import { UserEntry } from '../../src/models/user';
import app from '../../src/server';

const request = supertest(app);


describe('Users Handler', () => {
  beforeAll(async () => {
    // Reset table users before testing the order spec
    const conn = await client.connect();
    await conn.query("TRUNCATE users RESTART IDENTITY CASCADE;");
  }); // BEFORE ALL ends


  let user: UserEntry = {
    id: 1,
    username: 'testUser',
    firstname: '__',
    lastname: '__',
    password: 'UshallnotPASS'
  };

  const secret = (process.env.TOKEN_SECRET as unknown) as Secret;
  const mockToken = jwt.sign({
    user: {
      id: user.id,
      username: user.username
    } 
  }, secret);

  // isadmin property is added to mock the admin token
  const adminMockToken = jwt.sign({
    user: {
      id: user.id,
      username: user.username,
      isadmin: true
    }
  }, secret);


  it('signup() expects 200', async () => {
    const response = await request.post('/users')
    .send({
      username: 'testUser',
      firstname: '__',
      lastname: '__',
      password: 'UshallnotPASS'
    });

    const token = response.headers['authorization'].split(' ')[1];
    expect(response.status).toBe(200);
    expect(response.body).toEqual(`token generated: ${token}`);
  });

  
  it('signin() expects 200', async () => {
    const response = await request.post('/users/login')
    .send({
      username: user.username,
      password: user.password
    });
    const token = response.headers['authorization'].split(' ')[1];
    // console.log('token ' + response.headers['authorization'].split(' ')[1]);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(`token generated: ${token}`);
  });


  it('index() returns one user with 200', async () => {
    const response = await request.get('/users')
    .set('Authorization', `Bearer ${adminMockToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{
      id: 1,
      username: 'testUser',
      firstname: '__',
      lastname: '__',
      isadmin: false
    }]);
  });


  it('get() returns a user with 200', async () => {
    const response = await request.get('/users/1')
    .set('Authorization', `Bearer ${mockToken}`);
    // console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      username: 'testUser',
      firstname: '__',
      lastname: '__'
    });
  });
});





