import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import { Book, BookStore } from './models/book';



const app = express();
const ADDRESS: string = '127.0.0.1';
const PORT: number = 3000;

app.use(bodyParser.json());


// VIEWS

// All books
app.get('/books', function(req: Request, res: Response) {
  const store = new BookStore();
  store.all()
    .then(result => {
      res.json(result);
    });
});

// GET book by id
app.get('/books/:id', function(req: Request, res: Response) {
  const store = new BookStore();
  store.get(req.params.id)
    .then(result => {
      res.json(result);
    });
});

// CREATE book
app.post('/books', function(req: Request, res: Response) {
  const store = new BookStore();
  store.create(req.body)
    .then(result => {
      res.json(result);
    });
});

// UPDATE book by id
app.put('/books/:id', function(req: Request, res: Response) {
  const store = new BookStore();
  store.update(req.params.id, req.body)
    .then(result => {
      res.json(result);
    });
});

// DELETE book by id
app.delete('/books/:id', function(req: Request, res: Response) {
  const store = new BookStore();
  store.delete(req.params.id)
    .then(result => {
      res.json(result);
    });
});


app.listen(3000, function () {
  console.log(`starting app on ${ADDRESS}:${PORT}`);
});