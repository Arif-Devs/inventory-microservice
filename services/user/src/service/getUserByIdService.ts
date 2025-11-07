import prisma from '@/config/prisma';
import { User } from '@prisma/client';

export const getUserByIdService = async (id: string, field?: string): Promise<{ user?: User | null; message?: string }> => {
  let user: User | null = null;

  if (field === 'authUserId') {
    user = await prisma.user.findUnique({ where: { authUserId: id } });
  } else {
    user = await prisma.user.findUnique({ where: { id } });
  }

  if (!user) {
    return { message: 'User not found' };
  }

  return { user };
};
