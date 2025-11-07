import prisma from '@/config/prisma';

export const InventoryService = {
	getInventoryDetails: async (id: string) => {
		return prisma.inventory.findUnique({
			where: { id },
			include: {
				histories: {
					orderBy: {
						createdAt: 'desc',
					},
				},
			},
		});
	},
};
