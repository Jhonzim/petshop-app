import { Link } from 'react-router-dom';
import type { Product } from '../types/product';
import { formatCurrency } from '../utils/currency';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <Link to={`/products/${product.id}`}>
        <img src={product.imageUrl} alt={product.name} className="h-48 w-full object-cover" loading="lazy" />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs uppercase tracking-wide text-primary">{product.category}</p>
        <Link to={`/products/${product.id}`} className="text-lg font-semibold hover:text-primary">
          {product.name}
        </Link>
        <p className="text-sm text-slate-600">{product.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-xl font-bold text-primary">{formatCurrency(product.price)}</span>
          <span className="text-xs text-slate-500">Estoque: {product.stock}</span>
        </div>
      </div>
    </article>
  );
}
