import express, { Request, Response } from 'express';
import verifyAuthToken from '../middlewares/authz';
import { Order, OrderProduct, OrderStore } from '../models/order';

import client from '../database';


const store = new OrderStore();


const index = async (_req: Request, res: Response) => {
  try {
    const products = await store.index();
    res.json(products);
  } catch (err) {
    res.status(400).json('err');
  }
};


const get = async (req: Request, res: Response) => {
  try {
    const order = await store.get(req.params.user_id);
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
  app.get('/orders', index);
  app.get('/orders?user_id', verifyAuthToken, get);
  app.post('/orders', verifyAuthToken, create);
  app.get('/orders/:order_id/products', getOrderDetails);
  app.post('/orders/:order_id/products', addProduct);
  app.put('/orders/:order_id/close', closeOrder);
  app.get('/orders/:order_id/check', checkOrder);
};


export default ordersRouter;