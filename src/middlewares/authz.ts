import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';


const secret = process.env.TOKEN_SECRET as string;

// const verifyAuthToken = (req: Request, res: Response, next: Function) => {
//   try {

//     const authorizationHeader = (req.headers.authorization as unknown) as string;
//     const token = authorizationHeader.split(' ')[1];
//     const decoded = jwt.verify(token, secret);
//     console.log(decoded);
//     next();

//   } catch (err) {
//     res.status(401).json(`Invalid token: ${err}`);
//   }
// };


const authzUser = (req: Request, res: Response, next: Function) => {
  try {
    if (!req.params.user_id) {
      return res.status(401).json('invalid URL, missing user_id')
    }
    if (!req.headers['authorization']) {
      return res.status(401).json(`missing token`);
    }

    const authorizationHeader = (req.headers.authorization as unknown) as string;
    const token = authorizationHeader.split(' ')[1];
    const decoded = (jwt.verify(token, secret) as unknown) as jwt.JwtPayload;
    // console.log(decoded);
    if (decoded.user.id !== parseInt(req.params.user_id)) {
      return res.status(401).json(`not authorized`);
    }

    next();
  } catch (err) {
    return res.status(401).json(`Invalid or missing token`);
  }
};


export default authzUser;