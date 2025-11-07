import prisma from '@/config/prisma';
import { ProductUpdateDTOSchema } from '@/schema/schemas';

export const updateProductService = async (id: string, body: unknown) => {
  // validate body
  const parsedBody = ProductUpdateDTOSchema.safeParse(body);
  if (!parsedBody.success) {
    return {
      success: false,
      status: 400,
      message: 'Invalid request body',
      errors: parsedBody.error.errors,
    };
  }

  // check if product exists
  const existingProduct = await prisma.product.findUnique({ where: { id } });
  if (!existingProduct) {
    return {
      success: false,
      status: 404,
      message: 'Product not found',
    };
  }

  // update product
  const updatedProduct = await prisma.product.update({
    where: { id },
    data: parsedBody.data,
  });

  return {
    success: true,
    status: 200,
    data: updatedProduct,
  };
};
