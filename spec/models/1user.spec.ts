import { User, UserEntry, UserStore } from '../../src/models/user';
import client from '../../src/database';

const store = new UserStore();


describe("User Model", async () => {
  beforeAll( async () => {
    // Reset all table users before testing the order spec
    const conn = await client.connect();
    await conn.query("TRUNCATE users RESTART IDENTITY CASCADE;");
    await conn.query("TRUNCATE orders RESTART IDENTITY CASCADE;");
    await conn.query("TRUNCATE products RESTART IDENTITY CASCADE;");
    conn.release();
  }); // BEFORE ALL ENDS

  const user: User = {
    username: 'testUser',
    firstname: "__",
    lastname: "__",
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
        username: 'testUser',
        firstname: '__',
        lastname: '__'
      });
  });

  it('method get(user_id) return a User by id', async () => {
      const result = await store.get('1');
      expect(result).toEqual({
        id: 1,
        username: 'testUser',
        firstname: '__',
        lastname: '__'
      });
  });

  it('method userExists() return a User if exists', async () => {
      const conn = await client.connect();
      const result = await store.userExists(user.username, conn);
      conn.release();
      expect(result).toBeDefined();
  });

  it('method authenticate() return User or null', async () => {
      // valid password
      let authedUser = await store.authenticate(user.username, user.password);
      expect(authedUser).toEqual({
        id: 1,
        username: 'testUser',
        isadmin: false
      });

      // invalid password
      authedUser = await store.authenticate(user.firstname, 'AwrongPass');
      expect(authedUser).toEqual(null);
  });
});
