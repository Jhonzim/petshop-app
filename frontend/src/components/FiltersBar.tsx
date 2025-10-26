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
    <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-end">
      <div className="flex flex-1 flex-col gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="q">
          Busca
        </label>
        <input
          id="q"
          type="text"
          value={filters.q}
          onChange={(event) => onChange({ q: event.target.value })}
          placeholder="Busque por nome, categoria ou descrição"
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="category">
          Categoria
        </label>
        <select
          id="category"
          value={filters.category}
          onChange={(event) => onChange({ category: event.target.value })}
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">Todas</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-1 gap-4">
        <div className="flex flex-1 flex-col gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="minPrice">
            Preço mínimo
          </label>
          <input
            id="minPrice"
            type="number"
            min={0}
            value={filters.minPrice}
            onChange={(event) => onChange({ minPrice: event.target.value })}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="maxPrice">
            Preço máximo
          </label>
          <input
            id="maxPrice"
            type="number"
            min={0}
            value={filters.maxPrice}
            onChange={(event) => onChange({ maxPrice: event.target.value })}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={onReset}
          disabled={!hasFilters}
          className="rounded bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Limpar filtros
        </button>
      </div>
    </div>
  );
}
