import { Response, Request, NextFunction } from 'express';
import { userLoginService } from '../service/userLoginService';

const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.ip || '';
    const userAgent = req.headers['user-agent'] || '';

    const result = await userLoginService(req.body, ipAddress, userAgent);

    if (result?.error) {
      return res.status(400).json({ errors: result.error });
    }

    if (result?.message && !result.accessToken) {
      return res.status(400).json({ message: result.message });
    }

    return res.status(200).json({
      accessToken: result.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export default userLogin;
