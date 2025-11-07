import { INVENTORY_URL } from '@/config/config';
import prisma from '@/config/prisma';
import { productCreateDTOSchema } from '@/schema/schemas';
import axios from 'axios';

export const createProductService = async (body: unknown) => {
  // Validate the request body
  const parsedBody = productCreateDTOSchema.safeParse(body);
  if (!parsedBody.success) {
    return {
      success: false,
      status: 400,
      message: 'Invalid request body',
      errors: parsedBody.error.errors,
    };
  }

  // Check if product already exists
  const existProduct = await prisma.product.findFirst({
    where: { sku: parsedBody.data.sku },
  });
  if (existProduct) {
    return {
      success: false,
      status: 400,
      message: 'Product already exists with same SKU',
    };
  }

  // Create product
  const product = await prisma.product.create({
    data: parsedBody.data,
  });

  // Create inventory record
  const { data: inventory } = await axios.post(`${INVENTORY_URL}/inventories`, {
    productId: product.id,
    sku: product.sku,
  });

  // Update product with inventoryId
  const updatedProduct = await prisma.product.update({
    where: { id: product.id },
    data: { inventoryId: inventory.id },
  });

  return {
    success: true,
    status: 201,
    data: updatedProduct,
  };
};
