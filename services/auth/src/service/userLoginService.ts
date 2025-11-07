import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from 'config/prisma';
import { UserLoginSchema } from '@/schema';
import { LoginAttempt } from '@prisma/client';

type LoginHistory = {
  userId: string;
  userAgent: string | undefined;
  ipAddress: string | undefined;
  attempt: LoginAttempt;
};

export const createLoginHistory = async (info: LoginHistory) => {
  await prisma.loginHistory.create({
    data: {
      userId: info.userId,
      userAgent: info.userAgent,
      ipAddress: info.ipAddress,
      attempt: info.attempt,
    },
  });
};

export const userLoginService = async (body: any, ipAddress: string, userAgent: string) => {
  // Validate the request body
  const parsedBody = UserLoginSchema.safeParse(body);
  if (!parsedBody.success) {
    return { error: parsedBody.error.errors };
  }

  // check if the user exists
  const user = await prisma.user.findUnique({
    where: {
      email: parsedBody.data.email,
    },
  });
  if (!user) {
    return { message: 'Invalid credentials' };
  }

  // compare password
  const isMatch = await bcrypt.compare(parsedBody.data.password, user.password);
  if (!isMatch) {
    await createLoginHistory({
      userId: user.id,
      userAgent,
      ipAddress,
      attempt: 'FAILED',
    });
    return { message: 'Invalid credentials' };
  }

  // check if the user is verified
  if (!user.verified) {
    await createLoginHistory({
      userId: user.id,
      userAgent,
      ipAddress,
      attempt: 'FAILED',
    });
    return { message: 'User not verified' };
  }

  // check if the account is active
  if (user.status !== 'ACTIVE') {
    await createLoginHistory({
      userId: user.id,
      userAgent,
      ipAddress,
      attempt: 'FAILED',
    });
    return { message: `Your account is ${user.status.toLocaleLowerCase()}` };
  }

  console.log('JWT_SECRET', process.env.JWT_SECRET);

  // generate access token
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, name: user.name, role: user.role },
    process.env.JWT_SECRET ?? 'My_Secret_Key',
    { expiresIn: '2h' }
  );

  await createLoginHistory({
    userId: user.id,
    userAgent,
    ipAddress,
    attempt: 'SUCCESS',
  });

  return { accessToken };
};
