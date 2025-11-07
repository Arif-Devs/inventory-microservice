import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import { AccessTokenSchema } from '@/schema';

export const verifyTokenService = async (body: any) => {
  // Validate the request body
  const parsedBody = AccessTokenSchema.safeParse(body);
  if (!parsedBody.success) {
    return { error: parsedBody.error.errors };
  }

  console.log('JWT_SECRET', process.env.JWT_SECRET);

  const { accessToken } = parsedBody.data;
  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET as string);

  const user = await prisma.user.findUnique({
    where: { id: (decoded as any).userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });

  if (!user) {
    return { message: 'Unauthorized' };
  }

  return { message: 'Authorized', user };
};
