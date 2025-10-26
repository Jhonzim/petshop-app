import prisma from '../lib/prisma';
import { ProductBody } from '../validations/productSchemas';

export interface ProductFilters {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page: number;
  pageSize: number;
}

export async function findProducts(filters: ProductFilters) {
  const where: Record<string, unknown> = {};

  if (filters.q?.trim()) {
    const searchTerm = filters.q.trim();
    where.OR = [
      { name: { contains: searchTerm } },
      { description: { contains: searchTerm } },
      { category: { contains: searchTerm } }
    ];
  }

  if (filters.category) {
    where.category = filters.category;
  }

  if (typeof filters.minPrice === 'number' || typeof filters.maxPrice === 'number') {
    where.price = {};
    if (typeof filters.minPrice === 'number') {
      (where.price as Record<string, number>).gte = filters.minPrice;
    }
    if (typeof filters.maxPrice === 'number') {
      (where.price as Record<string, number>).lte = filters.maxPrice;
    }
  }

  const skip = (filters.page - 1) * filters.pageSize;
  const [data, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: filters.pageSize
    }),
    prisma.product.count({ where })
  ]);

  return { data, total };
}

export async function findProductById(id: number) {
  return prisma.product.findUnique({ where: { id } });
}

export async function findProductBySku(sku: string) {
  return prisma.product.findUnique({ where: { sku } });
}

export async function createProduct(payload: ProductBody) {
  return prisma.product.create({ data: payload });
}

export async function updateProduct(id: number, payload: ProductBody) {
  return prisma.product.update({ where: { id }, data: payload });
}

export async function deleteProduct(id: number) {
  return prisma.product.delete({ where: { id } });
}

export async function decrementProductStock(id: number, amount: number) {
  return prisma.product.update({
    where: { id },
    data: {
      stock: {
        decrement: amount
      }
    }
  });
}
