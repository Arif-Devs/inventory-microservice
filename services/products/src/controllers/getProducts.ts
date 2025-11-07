import { NextFunction, Request, Response } from 'express';
import { getProductsService } from '../service/getProducts';

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getProductsService()

    return res.status(result.status).json({ data: result.data });
  } catch (error) {
    next(error);
  }
};

export default getProducts