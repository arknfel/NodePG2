"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var secret = process.env.TOKEN_SECRET;
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
var authzUser = function (req, res, next) {
    try {
        if (!req.params.user_id) {
            return res.status(401).json('invalid URL, missing user_id');
        }
        if (!req.headers['authorization']) {
            return res.status(401).json("missing token");
        }
        var authorizationHeader = req.headers.authorization;
        var token = authorizationHeader.split(' ')[1];
        var decoded = jsonwebtoken_1.default.verify(token, secret);
        // console.log(decoded);
        if (decoded.user.id !== parseInt(req.params.user_id)) {
            return res.status(401).json("not authorized");
        }
        next();
    }
    catch (err) {
        return res.status(401).json("Invalid or missing token");
    }
};
exports.default = authzUser;
