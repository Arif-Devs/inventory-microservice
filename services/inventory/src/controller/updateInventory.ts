import { NextFunction, Request, Response } from 'express';
import { InventoryUpdateDTOSchema } from '@/schema/schemas';
import { InventoryService } from '../service/updateInventoryService';

export const updateInventory = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;

		// Validate body
		const parsedBody = InventoryUpdateDTOSchema.safeParse(req.body);
		if (!parsedBody.success) {
			return res.status(400).json({ errors: parsedBody.error.errors });
		}

		// Check if exists
		const inventory = await InventoryService.findById(id);
		if (!inventory) {
			return res.status(404).json({ message: 'Inventory not found' });
		}

		// Update
		const updated = await InventoryService.updateInventory(id, parsedBody.data);

		return res.status(200).json(updated);
	} catch (err) {
		next(err);
	}
};

export default updateInventory