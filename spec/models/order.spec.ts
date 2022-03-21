import { Order, OrderStore } from '../../src/models/order';
import client from '../../src/database';


const orderStore = new OrderStore();

describe("Order Model", () => {

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

  it('checkOrderStatus() expects order_id 1 status to be complete', async () => {
    const result = await orderStore.checkOrderStatus('1');
    expect(result.status).toEqual('complete');
  });

  it('addProduct() throws err since order status is complete', async () => {
    await expectAsync(orderStore.addProduct('1', '5', '1'))
    .toBeRejectedWithError(/.+already complete/);
  });

  // closeOrder() throws an err if order is already complete
  // if Order status is 'active', update it to 'complete'
  it('closeOrder() throws err if order is complete, else, closes order', async () => {
    await expectAsync(orderStore.closeOrder('1'))
    .toBeRejectedWithError(/.+already complete/);

    // setting order to be active
    const conn = await client.connect();
    await conn.query("UPDATE orders SET status='active' \
    WHERE id=1;");
    conn.release();

    const result = await orderStore.closeOrder('1');
    expect(result.status).toEqual('complete');
  });
});