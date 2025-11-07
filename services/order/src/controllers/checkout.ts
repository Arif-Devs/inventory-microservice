import { Request, Response, NextFunction } from 'express';
import { checkoutService } from '../service/checkout';

export const checkout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await checkoutService(req.body);

    if (!result.success) {
      return res.status(result.status).json(result.errors || { message: result.message });
    }

    return res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
};


export default checkout;