import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const verifyAuthToken = (req: Request, res: Response, next: Function) => {
  try {
    
    const secret = process.env.TOKEN_SECRET as string;
    const authorizationHeader = (req.headers.authorization as unknown) as string;
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.verify(token, secret);
    next();

  } catch (err) {
    res.status(401).json(`Invalid token: ${err}`);
  }
};


export default verifyAuthToken;