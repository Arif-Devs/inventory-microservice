import prisma from '../config/prisma';
import { UserCreateDTOSchema } from '@/schemas';

export const createUserService = async (body: any) => {
  // Validate the request body
  const parsedBody = UserCreateDTOSchema.safeParse(body);
  if (!parsedBody.success) {
    return { error: parsedBody.error.errors };
  }

  // check if the authUserId already exists
  const existingUser = await prisma.user.findUnique({
    where: { authUserId: parsedBody.data.authUserId },
  });
  if (existingUser) {
    return { message: 'User already exists' };
  }

  // Create a new user
  const user = await prisma.user.create({
    data: parsedBody.data,
  });

  return { user };
};
