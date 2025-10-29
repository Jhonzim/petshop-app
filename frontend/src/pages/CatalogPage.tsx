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
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="max-w-2xl space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Catálogo</h1>
            <p className="mt-2 text-lg text-slate-600">Explore nossa seleção especial de produtos para o seu pet.</p>
          </div>
          <FiltersBar filters={filters} onChange={handleFiltersChange} onReset={handleResetFilters} />
        </div>
        {user?.role === Roles.ADMIN && (
          <Link
            to="/admin/dashboard"
            className="group inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-600 hover:shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Novo produto
          </Link>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 rounded-lg bg-white px-6 py-4 shadow-sm">
            <svg className="h-5 w-5 animate-spin text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm font-medium text-slate-600">Carregando produtos...</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 p-4">
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium text-red-600">{error}</p>
          </div>
        </div>
      )}

      {!isLoading && !error && data && (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.data.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {data.data.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-slate-300 bg-white py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-900">Nenhum produto encontrado</p>
                <p className="mt-1 text-sm text-slate-600">Tente ajustar os filtros de busca</p>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
              >
                Limpar filtros
              </button>
            </div>
          )}

          {data.data.length > 0 && (
            <div className="mt-8 flex items-center justify-between gap-4 rounded-lg bg-white p-4 shadow-sm">
              <button
                type="button"
                onClick={handlePreviousPage}
                disabled={page === 1}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Anterior
              </button>
              
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-primary">Página {data.pagination.page}</span>
                <span className="text-slate-400">de</span>
                <span className="font-medium text-slate-900">{data.pagination.totalPages}</span>
              </div>

              <button
                type="button"
                onClick={handleNextPage}
                disabled={page === data.pagination.totalPages}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Próxima
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
