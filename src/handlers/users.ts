import express, { Request, Response } from 'express';
import { User, UserStore } from '../models/user';


const store = new UserStore();

const create = async (req: Request, res: Response) => {
  const result = await store.create({
    username: req.body.username,
    email_address: req.body.email_address,
    password: req.body.password
  });
  res.json(result);
};

const login = async (req: Request, res: Response) => {
  const result = await store.authenticate(
    req.body.username,
    req.body.password
  );
  res.json(result);
}

const usersRoutes = (app: express.Application) => {
  app.post('/users/login', login);
  app.post('/users', create);
}

export default usersRoutes;