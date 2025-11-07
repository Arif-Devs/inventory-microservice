import prisma from '@/config/prisma';

export const getProductsService = async () => {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      sku: true,
      name: true,
      price: true,
      inventoryId: true,
    },
  });

  return {
    success: true,
    status: 200,
    data: products,
  };
};
