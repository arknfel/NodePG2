import bodyParser from 'body-parser';
import express from 'express';
import booksRoutes from './handlers/books';
import ordersRoutes from './handlers/orders';
import productsRoutes from './handlers/products';
import usersRoutes from './handlers/users';


const app = express();
const ADDRESS: string = '127.0.0.1';
const PORT: number = 3000;


app.use(express.json());

booksRoutes(app);
usersRoutes(app);
productsRoutes(app);
ordersRoutes(app);


app.listen(3000, function () {
  console.log(`starting app on ${ADDRESS}:${PORT}`);
});

