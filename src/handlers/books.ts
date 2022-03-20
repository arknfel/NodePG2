import express, { Request, Response } from 'express';
import verifyAuthToken from '../middlewares/authz';
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

const create = async (_req: Request, res: Response) => {

  try {
    const result = await store.create({
      title: _req.body.title,
      total_pages: _req.body.total_pages,
      author: _req.body.author,
      summary: _req.body.summary
    });
    res.json(result);

  } catch (err) {
    res.status(400).json(err);
    return
  }
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


const booksRouter = (app: express.Application) => {
  app.get('/books', index);
  app.get('/books/:id', get);
  app.post('/books', verifyAuthToken, create);
  app.put('/books/:id', verifyAuthToken, update);
  app.delete('/books/:id', verifyAuthToken, del);
};


export default booksRouter;