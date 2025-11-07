import { defaultSender, transporter } from '@/config/db';
import prisma from '../config/prisma';

export const EmailService = {
	sendEmail: async (data: {
		sender?: string;
		recipient: string;
		subject: string;
		body: string;
        source: string;
	}) => {
		const from = data.sender || defaultSender;

		// Prepare email
		const emailOption = {
			from,
			to: data.recipient,
			subject: data.subject,
			text: data.body,
		};

		// Send email
		const { rejected } = await transporter.sendMail(emailOption);
		if (rejected.length) {
			return { success: false, rejected };
		}

		// Save to database
		await prisma.email.create({
			data: {
				sender: from,
				recipient: data.recipient,
				subject: data.subject,
				body: data.body,
				source: data.source,
			},
		});

		return { success: true };
	},
};
