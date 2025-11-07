import { Request, Response, NextFunction } from 'express';
import { verifyTokenService } from '../service/verifyTokenService';

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await verifyTokenService(req.body);

    if (result?.error) {
      return res.status(400).json({ errors: result.error });
    }

    if (result?.message === 'Unauthorized') {
      return res.status(401).json({ message: result.message });
    }

    return res.status(200).json({ message: result.message, user: result.user });
  } catch (error) {
    next(error);
  }
};

export default verifyToken;
