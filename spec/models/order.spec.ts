import { Order, OrderEntry, OrderProduct, OrderStore } from '../../src/models/order';
import client from '../../src/database';
import { User, UserStore } from '../../src/models/user';
import { Product, ProductStore } from '../../src/models/product';

const orderStore = new OrderStore();
const userStore = new UserStore();
const productStore = new ProductStore


fdescribe("Order Model", () => {
  beforeAll(async () => {
    // Reset table users before testing the order spec
    const conn = await client.connect();
    await conn.query("TRUNCATE users RESTART IDENTITY CASCADE;");

    // creating a user and a product to satisfy foriegn-key constrains 
    await conn.query("INSERT INTO users (firstname, lastname, password) \
      VALUES ('testUser', 'lastname', 'UshallnotPASS');")
    
    await conn.query("INSERT INTO products (name, price) \
      VALUES ('testProduct01', 42.42);").then(() => conn.release());
    
  });

  const order: Order = {
    user_id: '1',
    status: 'active'
  };

  const user: User = {
    firstname: "testUser",
    lastname: "__",
    password: "UshallnotPASS"
  };

  it('create() returns an Order', async () => {   

    const result = await orderStore.create(order);
    
    expect(result).toEqual({
      id: 1,
      user_id: '1',
      status: 'active'
    });
  });

  it('getOrder() returns an Order by user_id, order_id', async () => {
    const result = await orderStore.getOrder('1', '1');
    expect({
      id: result.id,
      user_id: result.user_id,
      status: result.status
    }).toEqual({
      id: 1,
      user_id: '1',
      status: 'active'
    });
  });


  it('checkOrderStatus() returns Order by order_id', async () => {
    const result = await orderStore.checkOrderStatus('1');
    expect(result).toEqual({
      id: 1,
      user_id: '1',
      status: 'active'
    });
  });

  // // Checks for Order status
  // // addProduct() adds an order_products entry if Order is active
  // // throws error if Order was complete while adding a product.
  it('addProduct() returns Order', async () => {
    const result = await orderStore.addProduct('1', '5', '1');
    expect(result).toEqual({
      order_id: '1',
      quantity: 5,
      product_id: '1'
    });
  });

  
  it('completedOrders() returns all completed Orders by user_id', async () => {
    const conn = await client.connect();

    // setting order to be complete
    await conn.query("UPDATE orders SET status='complete' \
      WHERE id=1;");
    conn.release();

    // expecting 1 completed orders for user_id 1
    const result = await orderStore.completedOrders('1');
    expect(result.length).toEqual(1);
  });

  it('expect order_id 1 status to be complete', async () => {
    const result = await orderStore.checkOrderStatus('1');
    expect(result.status).toEqual('complete');
  });

  it('addProduct() throws err', async () => {
    await expectAsync(orderStore.addProduct('1', '5', '1'))
    // .toBeRejectedWithError('Unable to add product: Error: order 1 is already complete');
    .toBeRejectedWithError(/.+already complete/);
  });
});