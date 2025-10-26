import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import FiltersBar from '../components/FiltersBar';
import ProductCard from '../components/ProductCard';
import type { PaginatedProducts, Product } from '../types/product';
import { useAuth } from '../contexts/AuthContext';
import { Roles } from '../types/auth';

interface Filters {
  q: string;
  category: string;
  minPrice: string;
  maxPrice: string;
}

const initialFilters: Filters = { q: '', category: '', minPrice: '', maxPrice: '' };

export default function CatalogPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<PaginatedProducts | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q);
    if (filters.category) params.set('category', filters.category);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    params.set('page', String(page));
    params.set('pageSize', '12');
    return params.toString();
  }, [filters, page]);

  useEffect(() => {
    if (!user) return;

    async function fetchProducts() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get<PaginatedProducts>(`/api/products?${queryString}`);
        setData(response.data);
      } catch (err: any) {
        setError(err?.response?.data?.error?.message ?? 'Não foi possível carregar os produtos.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [queryString, user]);

  function handleFiltersChange(partial: Partial<Filters>) {
    setFilters((prev) => ({ ...prev, ...partial }));
    setPage(1);
  }

  function handleResetFilters() {
    setFilters(initialFilters);
    setPage(1);
  }

  function handleNextPage() {
    if (!data) return;
    if (page < data.pagination.totalPages) {
      setPage((prev) => prev + 1);
    }
  }

  function handlePreviousPage() {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Catálogo</h1>
          <p className="text-sm text-slate-600">Explore nossos itens favoritos para o seu pet.</p>
        </div>
        {user?.role === Roles.ADMIN && (
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center justify-center rounded bg-primary px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-blue-600"
          >
            + Novo produto
          </Link>
        )}
      </div>

      <FiltersBar filters={filters} onChange={handleFiltersChange} onReset={handleResetFilters} />

      {isLoading && <p className="text-sm text-slate-600">Carregando produtos...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!isLoading && !error && data && (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.data.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {data.data.length === 0 && (
            <p className="rounded border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-600">
              Nenhum produto encontrado com os filtros selecionados.
            </p>
          )}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={handlePreviousPage}
              disabled={page === 1}
              className="rounded border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm text-slate-600">
              Página {data.pagination.page} de {data.pagination.totalPages}
            </span>
            <button
              type="button"
              onClick={handleNextPage}
              disabled={page === data.pagination.totalPages}
              className="rounded border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        </>
      )}
    </div>
  );
}
