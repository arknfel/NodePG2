import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserEntry } from '../models/user';


const secret = process.env.TOKEN_SECRET as string;

export const adminAuthToken = (req: Request, res: Response, next: Function) => {
  try {

    const authorizationHeader = (req.headers.authorization as unknown) as string;
    const token = authorizationHeader.split(' ')[1];

    const decoded = jwt.verify(token, secret) as { user: UserEntry; };

    if (!decoded.user.isadmin) {
      return res.status(401).json('unauthorized');
    }
    next();

  } catch (err) {
    res.status(401).json(`Invalid token: ${err}`);
  }
};


export const authzUser = (req: Request, res: Response, next: Function) => {
  try {

    if (!req.params.user_id) {
      return res.status(401).json('invalid URL, missing user_id')
    }

    if (!req.headers['authorization']) {
      return res.status(401).json(`missing token`);
    }

    const authorizationHeader = (req.headers.authorization as unknown) as string;
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.verify(token, secret) as { user: UserEntry };
    // console.log(decoded);
    if (decoded.user.id !== parseInt(req.params.user_id)) {
      return res.status(401).json(`unauthorized`);
    }

    next();

  } catch (err) {
    return res.status(401).json(`Invalid or missing token`);
  }
};


// export default {authzUser, verifyAuthToken};