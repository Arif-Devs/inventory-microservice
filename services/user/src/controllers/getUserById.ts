import { NextFunction, Request, Response } from 'express';
import { getUserByIdService } from '@/service/getUserByIdService';

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const field = req.query.field as string;

    const result = await getUserByIdService(id, field);

    if (result?.message === 'User not found') {
      return res.status(404).json({ message: result.message });
    }

    return res.json(result.user);
  } catch (error) {
    next(error);
  }
};

export default getUserById;
