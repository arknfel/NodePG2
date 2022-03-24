import express, { Request, Response } from 'express';
import authzUser from '../middlewares/authz';
import { Order, OrderProduct, OrderStore } from '../models/order';


const store = new OrderStore();


// INDEX
const index = async(req: Request, res: Response) => {
  try {
    const result = await store.index(req.params.user_id);
    res.json(result);
  } catch (err) {
    res.status(400).json(err);
  }
}

// const getOrder = async (req: Request, res: Response) => {
//   try {
//     const order_id = req.params.order_id;
//     const user_id = req.params.user_id;

//     const order = await store.getOrder(
//       order_id,
//       user_id
//     );
//     res.json(order);
//   } catch (err) {
//     res.status(400).json(`${err}`); 
//   }
// };


// SHOW
const checkOrder = async (req: Request, res: Response) => {
  try {
    const order = await store.checkOrderStatus(req.params.order_id);
    res.json(order);
  } catch (err) {
    res.status(400).json(`${err}`); 
  }
};


// CREATE
const create = async (req: Request, res: Response) => {
  try {
    if (!req.params.user_id) {
      return res.status(400).json('Invalid URL, missing user_id');
    }
    const product = await store.create(req.params.user_id);
    res.json(product);
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

    res.json(addedProduct);

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
};


const ordersRouter = (app: express.Application) => {
  app.get('/users/:user_id/orders', authzUser, index);
  app.get('/users/:user_id/orders/complete', authzUser, completedOrders);
  app.get('/users/:user_id/orders/:order_id', authzUser, checkOrder);
  app.post('/users/:user_id/orders', authzUser, create);
  app.get('/users/:user_id/orders/:order_id/details', authzUser, getOrderDetails);
  app.post('/users/:user_id/orders/:order_id/products', authzUser, addProduct);
  app.put('/users/:user_id/orders/:order_id/close', authzUser, closeOrder);

};


export default ordersRouter;
