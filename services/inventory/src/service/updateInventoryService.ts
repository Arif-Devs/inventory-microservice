import prisma from '@/config/prisma';

export const InventoryService = {
	findById: async (id: string) => {
		return prisma.inventory.findUnique({
			where: { id },
		});
	},

	getLastHistory: async (inventoryId: string) => {
		return prisma.history.findFirst({
			where: { inventoryId },
			orderBy: { createdAt: 'desc' },
		});
	},

	updateInventory: async (id: string, data: {
		actionType: 'IN' | 'OUT';
		quantity: number;
	}) => {
		const inventory = await prisma.inventory.findUnique({ where: { id } });
		if (!inventory) return null;

		// find last history
		const lastHistory = await prisma.history.findFirst({
			where: { inventoryId: id },
			orderBy: { createdAt: 'desc' },
		});

		// calculate new quantity
		let newQuantity = inventory.quantity;

		if (data.actionType === 'IN') {
			newQuantity += data.quantity;
		} else if (data.actionType === 'OUT') {
			newQuantity -= data.quantity;
		}

		// update record
		return prisma.inventory.update({
			where: { id },
			data: {
				quantity: newQuantity,
				histories: {
					create: {
						actionType: data.actionType,
						quantityChanged: data.quantity,
						lastQuantity: lastHistory?.newQuantity || 0,
						newQuantity,
					},
				},
			},
			select: {
				id: true,
				quantity: true,
			},
		});
	},
};
