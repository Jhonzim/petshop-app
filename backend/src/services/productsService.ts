import { AppError } from '../types/errors';
import { ProductBody, ProductQuery } from '../validations/productSchemas';
import {
  createProduct,
  deleteProduct,
  findProductById,
  findProductBySku,
  findProducts,
  updateProduct,
  decrementProductStock
} from '../repositories/productsRepository';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 12;

export async function listProducts(query: ProductQuery) {
  const page = query.page ? Number(query.page) : DEFAULT_PAGE;
  const pageSize = query.pageSize ? Number(query.pageSize) : DEFAULT_PAGE_SIZE;

  const { data, total } = await findProducts({
    q: query.q,
    category: query.category,
    minPrice: query.minPrice ? Number(query.minPrice) : undefined,
    maxPrice: query.maxPrice ? Number(query.maxPrice) : undefined,
    page,
    pageSize
  });

  return {
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize) || 1
    }
  };
}

export async function getProduct(id: number) {
  const product = await findProductById(id);
  if (!product) {
    throw new AppError('Produto não encontrado.', 404);
  }
  return product;
}

export async function createNewProduct(payload: ProductBody) {
  const existing = await findProductBySku(payload.sku);
  if (existing) {
    throw new AppError('SKU já cadastrado.', 409);
  }
  return createProduct(payload);
}

export async function updateExistingProduct(id: number, payload: ProductBody) {
  const product = await findProductById(id);
  if (!product) {
    throw new AppError('Produto não encontrado.', 404);
  }

  if (payload.sku !== product.sku) {
    const skuInUse = await findProductBySku(payload.sku);
    if (skuInUse) {
      throw new AppError('SKU já cadastrado.', 409);
    }
  }

  return updateProduct(id, payload);
}

export async function removeProduct(id: number) {
  const product = await findProductById(id);
  if (!product) {
    throw new AppError('Produto não encontrado.', 404);
  }
  await deleteProduct(id);
}

export async function subtractProductStock(id: number, amount: number) {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new AppError('Quantidade inválida para subtração.', 400);
  }

  const product = await findProductById(id);
  if (!product) {
    throw new AppError('Produto não encontrado.', 404);
  }

  if (product.stock < amount) {
    throw new AppError('Estoque insuficiente para a operação.', 409);
  }

  const updated = await decrementProductStock(id, amount);
  return updated;
}
