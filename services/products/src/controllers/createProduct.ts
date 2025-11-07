import { NextFunction, Request, Response } from 'express';
import { createProductService } from '../service/createProduct';

 const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await createProductService(req.body);

    if (!result.success) {
      return res.status(result.status).json({
        message: result.message,
        errors: result.errors,
      });
    }

    return res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
};


export default createProduct
