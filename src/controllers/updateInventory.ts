import { updateInventoryDTOSchema } from './../schemas';
import { Request, Response, NextFunction } from 'express';
import prisma from '@/prisma';

const updateInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const inventory = await prisma.inventory.findUnique({
      where: { id },
    });
    if (!inventory) {
      return res.status(404).json({ message: 'product not found' });
    }

    //check safe parsed
    const parsedBody = updateInventoryDTOSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(404).json(parsedBody.error.errors);
    }

    // find last history

    const findHistory = await prisma.history.findFirst({
      where: { inventoryId: id },
      orderBy: { createdAt: 'desc' },
    });

    //calculate quantity

    let newQuantity = inventory.quantity;
    if (parsedBody.data.actionType === 'IN') {
      newQuantity += parsedBody.data.quantity;
    } else {
      newQuantity -= parsedBody.data.quantity;
    }

    //update inventory

    const updateInventory = await prisma.inventory.update({
      where: { id },
      data: {
        quantity: newQuantity,
        histories: {
          create: {
            actionType: parsedBody.data.actionType,
            quantityChanged: parsedBody.data.quantity,
            lastQuantity: findHistory?.newQuantity || 0,
            newQuantity,
          },
        },
      },
      select: {
        id: true,
        quantity: true,
      },
    });

    return res.status(200).json(updateInventory);
  } catch (error) {
    next(error);
  }
};

export default updateInventory;
