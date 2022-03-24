import express, { Request, response, Response } from 'express';
import { UserStore } from '../models/user';
import jwt, {Secret} from 'jsonwebtoken';
import { authzUser, adminAuthToken } from '../middlewares/authz';


const store = new UserStore();

const index = async (_req: Request, res: Response) => {
  try {
    const users = await store.index();
    res.json(users);
  } catch (err) {
    return res.status(400).json('Unable to get users.');
  }
};


const get = async (req: Request, res: Response) => {
  try {
    if (!req.params.user_id) {
      return res.status(401).json('Missing user_id.');
    }
    const user = await store.get(req.params.user_id);
    res.json(user);
  } catch (err) {
    return res.status(400).json(err);
  }
};


const create = async (req: Request, res: Response) => {

  if (
    !req.body.firstname
    || !req.body.lastname
    || !req.body.password
  ) {
    return res.status(401).json('Missing required fields.');
  }

  try {
    const newUser = await store.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: req.body.password
    });
    if (!newUser) { return res.status(401).json('User exists.') }
    
    const secret = (process.env.TOKEN_SECRET as unknown) as Secret;
    const token = jwt.sign({ user: newUser }, secret);
    res.setHeader('Authorization', `Bearer ${token}`);
    res.json('token generated');
  
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};


const login = async (req: Request, res: Response) => {

  if (!req.body.firstname || !req.body.password) {
    return res.status(401).json('invalid credntials');
  }

  const user = await store.authenticate(
    req.body.firstname,
    req.body.password
  );

  if (user) {
    const secret = (process.env.TOKEN_SECRET as unknown) as Secret;
    var token = jwt.sign({ user: user }, secret);
    res.setHeader('Authorization', `Bearer ${token}`);
    res.json('token generated');
  } else {
    res.status(401).json('User does not exist, may need to signup');
  }
}

const usersRouter = (app: express.Application) => {
  app.get('/users', adminAuthToken, index);
  app.get('/users/:user_id', authzUser, get);
  app.post('/users/login', login);
  app.post('/users', create);
}

export default usersRouter;