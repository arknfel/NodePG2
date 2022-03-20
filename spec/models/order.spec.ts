import { Order, OrderEntry, OrderProduct, OrderStore } from '../../src/models/order';
import client from '../../src/database';
import { nextTick } from 'process';

const store = new OrderStore();


xdescribe("Order Model", () => {

  let order: OrderEntry = {
    user_id: 1
  };

  it('index() returns []', () =>{
    nextTick (async () => {
      const result = await store.index();
      expect(result).toEqual([]);
    });
  });

  it('create() returns a User', (done: DoneFn) => {
    nextTick (async () => {
      const result = await store.create(order);
      expect(result).toEqual({
        id: '1',
        user_id: '1',
        status: 'active',
      });
      done();
    });
  });

  it('get() returns a user by id', () => {
    nextTick (async () => {
      const result = await store.get('1');
      expect(result).toEqual([]);
    });
  });


});