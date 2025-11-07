import { Response, Request, NextFunction } from 'express';
import { userRegistrationService } from '@/service/userRegisterService';

const userRegistration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userRegistrationService(req.body);

    if (result?.error) {
      return res.status(400).json({ errors: result.error });
    }

    if (result?.message === 'User already exists') {
      return res.status(400).json({ message: result.message });
    }

    return res.status(201).json({
      message: 'User created. Check your email for verification code',
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};

export default userRegistration;
