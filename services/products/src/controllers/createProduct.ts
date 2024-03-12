import prisma from '@/prisma';
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { productCreateDTOSchema } from '@/schemas';
import { INVENTORY_URL } from '@/config';

const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsedBody = productCreateDTOSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        message: 'invalid request body',
        errors: parsedBody.error.errors,
      });
    }

    const existProduct = await prisma.product.findFirst({
      where: {
        sku: parsedBody.data.sku,
      },
    });

    if (existProduct) {
      res.status(400).json({ message: 'product already exist with same sku' });
    }
    //create product
    const product = await prisma.product.create({
      data: parsedBody.data,
    });
    console.log('product create successfully', product.id);

    //create inventory record

    const { data: inventory } = await axios.post(
      `${INVENTORY_URL}/inventories`,
      {
        productId: product.id,
        sku: product.sku,
      }
    );
    console.log('Inventory create successfully', inventory.id);

    //update product

    await prisma.product.update({
      where: { id: product.id },
      data: {
        inventoryId: inventory.id,
      },
    });
    console.log('Product update successfully with inventory id', inventory.id);
    return res.status(201).json({ ...product, inventoryId: inventory.id });
  } catch (error) {
    next(error);
  }
};

export default createProduct;
