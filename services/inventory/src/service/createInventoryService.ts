import prisma from '@/config/prisma';

export const InventoryService = {
	createInventory: async (payload: any) => {
		// Build data for Prisma
		const inventoryData = {
			...payload,
			histories: {
				create: {
					actionType: 'IN',
					quantityChanged: payload.quantity,
					lastQuantity: 0,
					newQuantity: payload.quantity,
				},
			},
		};

		// Create inventory
		return prisma.inventory.create({
			data: inventoryData,
			select: {
				id: true,
				quantity: true,
			},
		});
	},
};
