import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import booksRoutes from './handlers/books';
import usersRoutes from './handlers/users';


const app = express();
const ADDRESS: string = '127.0.0.1';
const PORT: number = 3000;

app.use(bodyParser.json());

booksRoutes(app);
usersRoutes(app);


app.listen(3000, function () {
  console.log(`starting app on ${ADDRESS}:${PORT}`);
});

