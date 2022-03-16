import express, { Request, Response } from 'express';
import { User, UserStore } from '../models/user';
import jwt, {Secret} from 'jsonwebtoken';


const store = new UserStore();

const create = async (_req: Request, res: Response) => {
  const user: User = {
    username: _req.body.username,
    email_address: _req.body.email_address,
    password: _req.body.password
  };
  try {
    const newUser = await store.create(user);
    const secret = (process.env.TOKEN_SECRET as unknown) as Secret;
    var token = jwt.sign({ user: newUser }, secret);
    res.json(token);
  } catch (err) {
    res.status(400);
    res.json(err as string + user);
  }
  
  // res.json(result);
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