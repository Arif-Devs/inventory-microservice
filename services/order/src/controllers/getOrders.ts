import { Request, Response, NextFunction } from 'express';
import { getOrdersService } from '../service/getOrder';

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getOrdersService();
    return res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
};


export default getOrders