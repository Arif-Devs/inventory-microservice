import prisma from '@/config/prisma';

export const getOrdersService = async () => {
  const orders = await prisma.order.findMany();
  return {
    success: true,
    status: 200,
    data: orders,
  };
};
