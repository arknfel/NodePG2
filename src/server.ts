import express from 'express';
import dashboardRouter from './handlers/dashboards';
import ordersRouter from './handlers/orders';
import productsRouter from './handlers/products';
import usersRouter from './handlers/users';


const app = express();
const ADDRESS: string = '127.0.0.1';
const PORT: number = 3000;


app.use(express.json());

usersRouter(app);
productsRouter(app);
ordersRouter(app);
dashboardRouter(app);


app.listen(3000, function () {
  console.log(`starting app on ${ADDRESS}:${PORT}`);
});


export default app;

