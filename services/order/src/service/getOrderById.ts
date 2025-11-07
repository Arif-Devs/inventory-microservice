import prisma from '@/config/prisma';

export const getOrderByIdService = async (id: string) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      orderItems: true,
    },
  });

  if (!order) {
    return {
      success: false,
      status: 404,
      message: 'Order not found',
    };
  }

  return {
    success: true,
    status: 200,
    data: order,
  };
};