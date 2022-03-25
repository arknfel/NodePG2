import express, { Request, Response } from 'express';
import { Product, ProductEntry, ProductStore } from "../models/product";
import { adminAuthToken } from '../middlewares/authz';


const store = new ProductStore();


const index = async (_req: Request, res: Response) => {
  try {
    const products = await store.index();
    res.json(products);
  } catch (err) {
    res.status(400).json(`${err}`);
  }
};

const get = async (req: Request, res: Response) => {
  try {
    const product = await store.get(req.params.product_id);
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

const update = async (req: Request, res: Response) => {
  try {
    const product = await store.update(req.params.product_id, req.body);
    res.json(product);
  } catch (err) {
    res.status(400).json(`${err}`);
  }
}


const productsRouter = (app: express.Application) => {
  app.post('/products', adminAuthToken, create);
  app.get('/products', index);
  app.get('/products/:product_id', get);  // Show
  app.put('/products/:product_id', adminAuthToken, update);

};


export default productsRouter;