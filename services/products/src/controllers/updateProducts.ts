import { Request, Response, NextFunction } from 'express';
import { updateProductService } from '../service/updateProduct';

const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await updateProductService(req.params.id, req.body);

    if (!result.success) {
      return res.status(result.status).json({
        message: result.message,
        errors: result.errors,
      });
    }

    return res.status(result.status).json({ data: result.data });
  } catch (error) {
    next(error);
  }
};


export default updateProduct