import { Request, Response, NextFunction } from 'express';
import { getOrderByIdService } from "../service/getOrderById";

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getOrderByIdService(req.params.id);

    if (!result.success) {
      return res.status(result.status).json({ message: result.message });
    }

    return res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
};

export default getOrderById