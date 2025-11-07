import prisma from '../config/prisma';

export const EmailService = {
	getEmails: async () => {
		return prisma.email.findMany();
	},


};
