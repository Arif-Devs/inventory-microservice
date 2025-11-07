import { InventoryCreateDTOSchema } from '@/schema/schemas';
import { NextFunction, Request, Response } from 'express';
import { InventoryService } from '../service/createInventoryService';

export const createInventory = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const parsedBody = InventoryCreateDTOSchema.safeParse(req.body);

		if (!parsedBody.success) {
			return res.status(400).json({ error: parsedBody.error.errors });
		}

		const inventory = await InventoryService.createInventory(parsedBody.data);

		return res.status(201).json(inventory);
	} catch (error) {
		next(error);
	}
};

export default createInventory