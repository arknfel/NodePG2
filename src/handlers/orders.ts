import express, { Request, Response } from 'express';
import verifyAuthToken from '../middlewares/authz';
import { Order, OrderProduct, OrderStore } from '../models/order';

import client from '../database';
import { isBigInt64Array } from 'util/types';


const store = new OrderStore();


const getOrder = async (req: Request, res: Response) => {
  try {
    const order_id = req.params.order_id;
    const user_id = req.params.user_id;

    const order = await store.getOrder(
      order_id,
      user_id
    );
    res.json(order);
  } catch (err) {
    res.status(400).json(`${err}`); 
  }
};


const completedOrders = async (req: Request, res: Response) => {
  try {
    const user_id = req.params.user_id;
    const order = await store.completedOrders(user_id);
    res.json(order);
  } catch (err) {
    res.status(400).json(`${err}`);
  }
};


const create = async (req: Request, res: Response) => {
  try {
    const product = await store.create(req.body);
    res.json(product);
  } catch (err) {
    res.status(400).json(`${err}`);
  }
};


const addProduct = async (req: Request, res: Response) => {
  try {
    const addedProduct = await store.addProduct(
      req.params.order_id,
      req.body.quantity,
      req.body.product_id
    );

    // close order on product addition
    // if arg param status = 'complete'
    if (req.query.status && req.query.status == 'complete') {

      const closedOrder = await store.closeOrder(req.params.order_id);
      const orderProducts = await store.getProducts(req.params.order_id);
      
      return res.json({
        message: 'order complete',
        order: closedOrder,
        products: orderProducts
      });
    }

    res.json({
      product: addedProduct,
    });

  } catch (err) {
    res.status(400).json(`${err}`);
  }
};


const closeOrder = async (req: Request, res: Response) => {
  try {
    const closedOrder = await store.closeOrder(req.params.order_id);
    res.json(closedOrder);
  } catch (err) {
    res.status(400).json(`${err}`); 
  }
};


const getOrderDetails = async (req: Request, res: Response) => {
  try {
    const order = await store.checkOrderStatus(req.params.order_id);
    const products = await store.getProducts(req.params.order_id);
    res.json({order: order, products: products});

  } catch (err) {
    res.status(400).json(`${err}`); 
  }
}


const checkOrder = async (req: Request, res: Response) => {
  try {
    const order = await store.checkOrderStatus(req.params.order_id);
    res.json(order);
  } catch (err) {
    res.status(400).json(`${err}`); 
  }
}





const ordersRouter = (app: express.Application) => {
  // app.get('/orders', verifyAuthToken, index);
  app.get('/users/:user_id/orders/:order_id',verifyAuthToken, getOrder);
  app.get('/users/:user_id/orders/',verifyAuthToken, completedOrders);
  app.post('/orders', verifyAuthToken, create);
  app.get('/orders/:order_id/products', getOrderDetails);
  app.post('/orders/:order_id/products', addProduct);
  app.put('/orders/:order_id/close', closeOrder);
  app.get('/orders/:order_id/check', checkOrder);
};


export default ordersRouter;



// const user_id = req.params.user_id;
// let status = req.query.status as string;

// if (
//   !req.params.user_id
//   || isNaN(parseInt(user_id))
//   ) {
//     res.status(404).json(`missing user_id`);
// }
// if (
//   !status
//   || !((status as string) === 'active')
//   || !((status as string) === 'complete')
//   ) {
//     status = 'active'
// }