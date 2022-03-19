import express, { Request, response, Response } from 'express';
import { User, UserStore } from '../models/user';
import jwt, {Secret} from 'jsonwebtoken';
import verifyAuthToken from '../middlewares/authz';


const store = new UserStore();

const index = async (req: Request, res: Response) => {
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
      return res.status(401).json('Missing field firstname.');
    }
    const user = await store.get(req.params.user_id);
    res.json(user);
  } catch (err) {
    return res.status(400).json('Unable to get user.');
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
    var token = jwt.sign({ user: newUser }, secret);
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

const usersRoutes = (app: express.Application) => {
  app.get('/users', verifyAuthToken, index);
  app.get('/users/:user_id', verifyAuthToken, get);
  app.post('/users/login', login);
  app.post('/users', create);
}

export default usersRoutes;