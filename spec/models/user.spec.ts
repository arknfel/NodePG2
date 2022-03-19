import { User, UserEntry, UserStore } from '../../src/models/user';
import client from '../../src/database';

const store = new UserStore();


fdescribe("User Model", () => {
  beforeEach(function(done) {
    setTimeout(function() {
      done();
    }, 50);
  });

  afterEach(function(done) {
    done();
  });

  let user: User = {
    firstname: "testUser",
    lastname: "lastname",
    password: "UshallnotPASS"
  };

  it('method create() return a User', async () => {

    const result = await store.create(user);
    const cols = Object.keys(result as User);

    expect(result?.firstname).toEqual(user.firstname);
    expect(result?.lastname).toEqual(user.lastname);
    expect(result?.id).toEqual(1);
    expect(cols).toContain('password');
  });

  it('method get(user_id) return a User', async () => {

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
    expect(result.length).toEqual(1);
  });

  it('method authenticate() return User or null', async () => {

    // valid password
    let result = await store.authenticate(user.firstname, user.password);
    expect(result?.id).toEqual(1);
    expect(result?.firstname).toEqual(user.firstname);

    // invalid password
    result = await store.authenticate(user.firstname, 'wrongPass');
    expect(result).toBe(null);
  });
});
