import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import type { Product } from '../types/product';
import { formatCurrency } from '../utils/currency';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get<Product>(`/api/products/${id}`);
        setProduct(response.data);
      } catch (err: any) {
        setError(err?.response?.data?.error?.message ?? 'Produto não encontrado.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return <p className="text-sm text-slate-600">Carregando produto...</p>;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-600">{error}</p>
        <Link to="/" className="text-sm text-primary hover:underline">
          Voltar ao catálogo
        </Link>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="grid gap-8 md:grid-cols-[1.5fr_2fr]">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
      </div>
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-wide text-primary">{product.category}</p>
        <h1 className="text-3xl font-semibold">{product.name}</h1>
        <p className="text-xl font-bold text-primary">{formatCurrency(product.price)}</p>
        <p className="text-sm text-slate-600">SKU: {product.sku}</p>
        <p className="text-sm text-slate-600">Estoque: {product.stock} unidades</p>
        <p className="text-base text-slate-700">{product.description}</p>
        <div className="flex gap-4 pt-4">
          <Link
            to={`/admin/${product.id}`}
            className="rounded bg-primary px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-blue-600"
          >
            Editar produto
          </Link>
          <Link to="/" className="rounded border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
            Voltar
          </Link>
        </div>
      </div>
    </div>
  );
}
