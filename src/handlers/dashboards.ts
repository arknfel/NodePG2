import express, { Request, Response } from 'express'

import { DashboardQueries } from '../services/dashboard'


const dashboard = new DashboardQueries()

const topFiveSellers = async (_req: Request, res: Response) => {
  try {
    const products = await dashboard.topFiveSellers();
    res.json(products);
  } catch (err) {
    res.status(400).json(err);
  }
};


const dashboardRouter = (app: express.Application) => {
  app.get('/reports/top-five-sellers', topFiveSellers);
}

export default dashboardRouter