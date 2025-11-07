import { Request, Response, NextFunction } from 'express';
import { verifyEmailService } from '../service/verifyEmailService';

const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await verifyEmailService(req.body);

    if (result?.error) {
      return res.status(400).json({ errors: result.error });
    }

    if (result?.message && result.message !== 'Email verified successfully') {
      return res.status(400).json({ message: result.message });
    }

    return res.status(200).json({ message: result.message });
  } catch (error) {
    next(error);
  }
};

export default verifyEmail;
