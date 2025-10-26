import { z } from 'zod';

export const productBodySchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  sku: z.string().min(3, 'O SKU deve ter pelo menos 3 caracteres.'),
  category: z
    .string()
    .min(3, 'A categoria é obrigatória.')
    .refine((value) => value.trim().length > 0, 'A categoria é obrigatória.'),
  price: z
    .number({ invalid_type_error: 'O preço deve ser um número.' })
    .positive('O preço deve ser maior que zero.'),
  stock: z
    .number({ invalid_type_error: 'O estoque deve ser um número.' })
    .int('O estoque deve ser um número inteiro.')
    .nonnegative('O estoque não pode ser negativo.'),
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres.'),
  imageUrl: z.string().url('Forneça uma URL válida para a imagem.')
});

export type ProductBody = z.infer<typeof productBodySchema>;

export const productStockUpdateSchema = z.object({
  amount: z
    .number({ invalid_type_error: 'A quantidade deve ser um número.' })
    .int('A quantidade deve ser um número inteiro.')
    .positive('A quantidade deve ser maior que zero.')
});

export type ProductStockUpdateBody = z.infer<typeof productStockUpdateSchema>;

export const productQuerySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  minPrice: z
    .string()
    .optional()
    .refine((value) => !value || !Number.isNaN(Number(value)), 'minPrice deve ser um número.'),
  maxPrice: z
    .string()
    .optional()
    .refine((value) => !value || !Number.isNaN(Number(value)), 'maxPrice deve ser um número.'),
  page: z
    .string()
    .optional()
    .refine((value) => !value || Number(value) > 0, 'page deve ser maior que zero.'),
  pageSize: z
    .string()
    .optional()
    .refine((value) => !value || Number(value) > 0, 'pageSize deve ser maior que zero.')
});

export type ProductQuery = z.infer<typeof productQuerySchema>;
