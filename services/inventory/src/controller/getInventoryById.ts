import { NextFunction, Request, Response } from 'express';
import { InventoryService } from '../service/getInventoryByIdService';

export const getInventoryById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;

		const inventory = await InventoryService.getInventoryById(id);

		if (!inventory) {
			return res.status(404).json({ message: 'Inventory not found' });
		}

		return res.status(200).json(inventory);
	} catch (err) {
		next(err);
	}
};

export default getInventoryById