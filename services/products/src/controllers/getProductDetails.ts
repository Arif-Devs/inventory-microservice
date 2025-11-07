import { NextFunction, Request, Response } from 'express';
import { getProductDetailsService } from '../service/getProductDetails';

const getProductDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await getProductDetailsService(id);

    if (!result.success) {
      return res.status(result.status).json({ message: result.message });
    }

    return res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
};

export default getProductDetails