import express, { Request, Response } from 'express';
import { Product, ProductUpdates, ProductStore } from "../models/product";
import verifyAuthToken from '../middlewares/authz';


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

const hot = async (req: Request, res: Response) => {
  try {
    const products = await store.hot();
    res.json(products);
  } catch (err) {
    res.status(400).json(`${err}`);
  }
};


const productsRouter = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', get);  // Show
  app.post('/products', verifyAuthToken, create);
  app.get('/products/trends', hot)
};


export default productsRouter;