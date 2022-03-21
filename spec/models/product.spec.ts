import client from "../../src/database";
import { Product, ProductEntry, ProductStore } from "../../src/models/product";


const productStore = new ProductStore();

describe("Product Model", () => {

  beforeAll(async () => {
    // Reset table users before testing the order spec
    const conn = await client.connect();
    await conn.query("TRUNCATE users RESTART IDENTITY CASCADE;");
    await conn.query("TRUNCATE products RESTART IDENTITY CASCADE;");

    // creating a user and a product to satisfy foriegn-key constrains 
    await conn.query("INSERT INTO users (firstname, lastname, password) \
      VALUES ('testUser', 'lastname', 'UshallnotPASS');")
    
    conn.release();
  });

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


  it('get() returns a product by id', async () => {
    const productEntry: ProductEntry = {price: '79.99'};
    const result = await productStore.update('1', productEntry);
    expect(result).toEqual({
      id: 1,
      name: 'testProduct02',
      price: '$79.99'
    });
  });

});