import express, { Request, Response } from 'express';
import verifyAuthToken from '../middlewares/authz';
import { Order, OrderProductsEntry, OrderStore } from '../models/order';


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
    const product = await store.get(req.params.id);
    res.json(product);
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
    const orderProductsEntry: OrderProductsEntry = {
      quantity: req.body.quantity,
      order_id: req.params.id,
      product_id: req.body.product_id
    }
    const addedProduct = await store.addProduct(orderProductsEntry);
    res.json(addedProduct);
  } catch (err) {
    res.status(400).json(`${err}`);
  }
}

const ordersRoutes = (app: express.Application) => {
  app.get('/orders', index);
  app.get('/orders/:id', get);
  app.get('/orders/:user_id', verifyAuthToken, get);
  app.post('/orders', verifyAuthToken, create);
  app.post('/orders/:order_id/products', addProduct);
};


export default ordersRoutes;