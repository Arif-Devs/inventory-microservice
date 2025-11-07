import { Request, Response, NextFunction } from 'express';
import { createUserService } from '../service/createUserService';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await createUserService(req.body);

    if (result?.error) {
      return res.status(400).json({ message: result.error });
    }

    if (result?.message === 'User already exists') {
      return res.status(400).json({ message: result.message });
    }

    return res.status(201).json(result.user);
  } catch (error) {
    next(error);
  }
};

export default createUser;
