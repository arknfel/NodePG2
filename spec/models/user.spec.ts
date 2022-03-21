import { User, UserEntry, UserStore } from '../../src/models/user';
import client from '../../src/database';

const store = new UserStore();


describe("User Model", async () => {
  beforeAll( async () => {
    const conn = await client.connect();
    await conn.query('TRUNCATE users RESTART IDENTITY CASCADE;');
    conn.release();
  });

  const user: User = {
    firstname: "testUser",
    lastname: "lastname",
    password: "UshallnotPASS"
  };

  it('index() returns []', async () => {
      const result = await store.index();
      expect(result).toEqual([]);

  });

  it('method create() return a User', async () => {
      const result = await store.create(user);

      expect(result).toEqual({
        id: 1,
        firstname: 'testUser',
        lastname: 'lastname'
      });
  });

  it('method get(user_id) return a User by id', async () => {
      const result = await store.get('1');
      expect(result).toEqual({
        id: 1,
        firstname: 'testUser',
        lastname: 'lastname'
      });
  });

  it('method userExists() return a User if exists', async () => {
      const conn = await client.connect();
      const result = await store.userExists(user.firstname, conn);
      conn.release();
      expect(result.length).toEqual(1);
  });

  it('method authenticate() return User or null', async () => {
      // valid password
      let result = await store.authenticate(user.firstname, user.password);
      expect(result?.id).toEqual(1);

      // invalid password
      result = await store.authenticate(user.firstname, 'AwrongPass');
      expect(result).toEqual(null);
  });
});
