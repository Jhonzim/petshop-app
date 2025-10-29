import { useMemo } from 'react';

const categories = ['Rações', 'Acessórios', 'Higiene', 'Brinquedos', 'Medicamentos (OTC)'];

interface FiltersBarProps {
  filters: {
    q: string;
    category: string;
    minPrice: string;
    maxPrice: string;
  };
  onChange: (filters: Partial<FiltersBarProps['filters']>) => void;
  onReset: () => void;
}

export default function FiltersBar({ filters, onChange, onReset }: FiltersBarProps) {
  const hasFilters = useMemo(() => {
    return Object.values(filters).some((value) => value !== '');
  }, [filters]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 md:flex-row md:items-end">
        <div className="flex flex-1 flex-col gap-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700" htmlFor="q">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Buscar produtos
          </label>
          <input
            id="q"
            type="text"
            value={filters.q}
            onChange={(event) => onChange({ q: event.target.value })}
            placeholder="Digite nome, categoria ou descrição..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm placeholder:text-slate-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
          />
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700" htmlFor="category">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Categoria
          </label>
          <select
            id="category"
            value={filters.category}
            onChange={(event) => onChange({ category: event.target.value })}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
          >
            <option value="">Todas as categorias</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-1 gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700" htmlFor="minPrice">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Preço mínimo
            </label>
            <input
              id="minPrice"
              type="number"
              min={0}
              value={filters.minPrice}
              onChange={(event) => onChange({ minPrice: event.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700" htmlFor="maxPrice">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Preço máximo
            </label>
            <input
              id="maxPrice"
              type="number"
              min={0}
              value={filters.maxPrice}
              onChange={(event) => onChange({ maxPrice: event.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
            />
          </div>
        </div>

        {hasFilters && (
          <div className="flex flex-col gap-2">
            <label className="invisible text-sm font-medium text-slate-700">Ações</label>
            <button
              type="button"
              onClick={onReset}
              className="group flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-colors group-hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Limpar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
