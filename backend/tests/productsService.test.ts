import { describe, expect, it, vi, beforeEach } from 'vitest';
import * as repository from '../src/repositories/productsRepository';
import { listProducts } from '../src/services/productsService';

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
});
