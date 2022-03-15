import express, { Request, Response } from 'express';
import { Book, BookStore } from '../models/book';


const store = new BookStore();

const index = async (_req: Request, res: Response) => {
  const result = await store.index();
  res.json(result);
};

const get = async (req: Request, res: Response) => {
  const result = await store.get(req.params.id)
  res.json(result);
};

const create = async (req: Request, res: Response) => {
  const result = await store.create({
    title: req.body.title,
    total_pages: req.body.total_pages,
    author: req.body.author,
    summary: req.body.summary
  });
  res.json(result);
}

const update = async (req: Request, res: Response) => {
  const result = await store.update(req.params.id,
    {
      title: req.body.title,
      total_pages: req.body.total_pages,
      author: req.body.author,
      summary: req.body.summary
    });
  res.json(result);
};

const del = async (req: Request, res: Response) => {
  const result = await store.delete(req.params.id);
  res.json(result);
}


const booksRoutes = (app: express.Application) => {
  app.get('/books', index);
  app.get('/books/:id', get);
  app.post('/books', create);
  app.put('/books/:id', update);
  app.delete('/books/:id', del);
};


export default booksRoutes;