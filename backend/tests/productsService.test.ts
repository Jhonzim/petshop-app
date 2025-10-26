import { describe, expect, it, vi, beforeEach } from 'vitest';
import * as repository from '../src/repositories/productsRepository';
import { listProducts, subtractProductStock } from '../src/services/productsService';

describe('listProducts', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('deve aplicar paginação padrão quando não informada', async () => {
    const spy = vi.spyOn(repository, 'findProducts').mockResolvedValue({
      data: [],
      total: 0
    });

    const result = await listProducts({});

    expect(spy).toHaveBeenCalledWith({
      q: undefined,
      category: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      page: 1,
      pageSize: 12
    });
    expect(result.pagination).toEqual({ page: 1, pageSize: 12, total: 0, totalPages: 1 });
  });

  it('deve subtrair estoque quando houver quantidade suficiente', async () => {
    const findSpy = vi.spyOn(repository, 'findProductById').mockResolvedValue({
      id: 1,
      name: 'Produto Teste',
      sku: 'SKU-1',
      category: 'Categoria',
      price: 100,
      stock: 5,
      description: 'Descrição',
      imageUrl: 'https://example.com',
      createdAt: new Date(),
      updatedAt: new Date()
    } as any);
    const decrementSpy = vi.spyOn(repository, 'decrementProductStock').mockResolvedValue({ stock: 4 } as any);

    const result = await subtractProductStock(1, 1);

    expect(findSpy).toHaveBeenCalledWith(1);
    expect(decrementSpy).toHaveBeenCalledWith(1, 1);
    expect(result).toEqual({ stock: 4 });
  });

  it('deve lançar erro quando estoque for insuficiente', async () => {
    vi.spyOn(repository, 'findProductById').mockResolvedValue({ stock: 1 } as any);

    await expect(subtractProductStock(1, 2)).rejects.toMatchObject({ statusCode: 409 });
  });

  it('deve rejeitar quando quantidade for inválida', async () => {
    await expect(subtractProductStock(1, 0)).rejects.toMatchObject({ statusCode: 400 });
  });
});
