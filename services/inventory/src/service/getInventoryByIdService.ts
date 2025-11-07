import prisma from '@/config/prisma';

export const InventoryService = {
	getInventoryById: async (id: string) => {
		return prisma.inventory.findUnique({
			where: { id },
			select: {
				quantity: true,
			},
		});
	},
};
