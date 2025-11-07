import { INVENTORY_URL } from '@/config/config';
import prisma from '@/config/prisma';
import axios from 'axios';

export const getProductDetailsService = async (id: string) => {
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    return {
      success: false,
      status: 404,
      message: 'Product not found',
    };
  }

  // If inventoryId is null, create inventory and update product
  if (product.inventoryId === null) {
    const { data: inventory } = await axios.post(`${INVENTORY_URL}/inventories`, {
      productId: product.id,
      sku: product.sku,
    });

    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: { inventoryId: inventory.id },
    });

    return {
      success: true,
      status: 200,
      data: {
        ...updatedProduct,
        inventoryId: inventory.id,
        stock: inventory.quantity || 0,
        stockStatus: inventory.quantity > 0 ? 'In stock' : 'Out of stock',
      },
    };
  }

  // Fetch existing inventory details
  const { data: inventory } = await axios.get(
    `${INVENTORY_URL}/inventories/${product.inventoryId}`
  );

  return {
    success: true,
    status: 200,
    data: {
      ...product,
      stock: inventory.quantity || 0,
      stockStatus: inventory.quantity > 0 ? 'In stock' : 'Out of stock',
    },
  };
};
