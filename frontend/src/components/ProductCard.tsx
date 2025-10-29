import { Link } from 'react-router-dom';
import type { Product } from '../types/product';
import { formatCurrency } from '../utils/currency';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/products/${product.id}`} className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5 transition-colors group-hover:bg-black/0" />
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105" 
          loading="lazy" 
        />
        <div className="absolute right-2 top-2">
          <span className="inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-primary shadow-sm backdrop-blur-sm">
            {product.category}
          </span>
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <Link to={`/products/${product.id}`} className="group/title">
          <h3 className="text-lg font-semibold text-slate-900 transition-colors group-hover/title:text-primary">
            {product.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-600">
            {product.description}
          </p>
        </Link>
        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="flex flex-col gap-1">
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(product.price)}
            </span>
            <span className="text-xs text-slate-500">
              {product.stock > 0 ? `${product.stock} em estoque` : 'Fora de estoque'}
            </span>
          </div>
          <Link 
            to={`/products/${product.id}`}
            className="rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
          >
            Ver detalhes
          </Link>
        </div>
      </div>
    </article>
  );
}
