import { Status } from '@prisma/client';
import { z } from 'zod';

export const productCreateDTOSchema = z.object({
  sku: z.string().min(3).max(10),
  name: z.string().min(3).max(255),
  description: z.string().max(1000).optional(),
  price: z.number().optional().default(0),
  status: z.nativeEnum(Status).optional().default(Status.DRAFT),
});

export const ProductUpdateDTOSchema = productCreateDTOSchema.omit({
	sku: true,
}).partial();