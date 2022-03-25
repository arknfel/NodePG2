import client from "../../src/database";
import { Product, ProductEntry, ProductStore } from "../../src/models/product";


const productStore = new ProductStore();

describe("Product Model", () => {

  beforeAll(async () => {
    // Reset all tables before testing
    const conn = await client.connect();
    await conn.query("TRUNCATE users RESTART IDENTITY CASCADE; \
      TRUNCATE products RESTART IDENTITY CASCADE;");

    // creating a user and a product to satisfy foriegn-key constrains 
    await conn.query("INSERT INTO users (username, firstname, lastname, password, isAdmin) \
      VALUES ('testUser', '__', '__', 'UshallnotPASS', '0');");
    
    conn.release();
  }); // BEFORE ALL ends


  const product: Product = {
    name: 'testProduct02',
    price: '99.99'
  };

  it('create() returns a product', async () => {   
    const result = await productStore.create(product);
    expect(result).toEqual({
      id: 1,
      name: 'testProduct02',
      price: '$99.99'
    });
  });


  it('get() returns a product by id', async () => {   
    const result = await productStore.get('1');
    expect(result).toEqual({
      id: 1,
      name: 'testProduct02',
      price: '$99.99'
    });
  });


  it('update() returns updated product obj', async () => {
    const productEntry: ProductEntry = {price: '79.99'};
    const result = await productStore.update('1', productEntry);
    expect(result).toEqual({
      id: 1,
      name: 'testProduct02',
      price: '$79.99'
    });
  });

});