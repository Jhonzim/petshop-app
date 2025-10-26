import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import type { Product } from '../types/product';
import { formatCurrency } from '../utils/currency';
import { useAuth } from '../contexts/AuthContext';
import { Roles } from '../types/auth';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const { user } = useAuth();
  const isBuyer = user?.role === Roles.BUYER;
  const isAdmin = user?.role === Roles.ADMIN;

  useEffect(() => {
    if (!id || !user) return;

    async function fetchProduct() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get<Product>(`/api/products/${id}`);
        setProduct(response.data);
        setQuantity(1);
        setPurchaseMessage(null);
        setPurchaseError(null);
      } catch (err: any) {
        setError(err?.response?.data?.error?.message ?? 'Produto não encontrado.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [id, user]);

  async function handlePurchase() {
    if (!id || !product) return;

    setIsPurchasing(true);
    setPurchaseMessage(null);
    setPurchaseError(null);

    try {
      const response = await api.post<Product>(`/api/products/${id}/decrement`, {
        amount: quantity
      });
      setProduct(response.data);
      setQuantity(1);
      setPurchaseMessage('Compra realizada com sucesso! Estoque atualizado.');
    } catch (err: any) {
      const message = err?.response?.data?.error?.message ?? 'Não foi possível concluir a compra.';
      setPurchaseError(message);
    } finally {
      setIsPurchasing(false);
    }
  }

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
        {isBuyer && (
          <div className="rounded border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-sm font-semibold text-slate-700">Comprar produto</h2>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
              <label className="flex flex-col text-xs font-medium text-slate-600">
                Quantidade
                <input
                  type="number"
                  min={1}
                  max={product.stock}
                  value={quantity}
                  disabled={product.stock === 0}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    if (Number.isNaN(value)) {
                      setQuantity(1);
                      return;
                    }
                    setQuantity(Math.min(Math.max(1, value), product.stock));
                  }}
                  className="mt-1 w-24 rounded border border-slate-300 px-2 py-1 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <button
                type="button"
                onClick={handlePurchase}
                disabled={isPurchasing || product.stock === 0}
                className="inline-flex items-center justify-center rounded bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPurchasing ? 'Processando...' : 'Comprar'}
              </button>
            </div>
            {product.stock === 0 && <p className="mt-2 text-xs text-red-600">Produto indisponível no momento.</p>}
            {purchaseMessage && <p className="mt-2 text-xs text-green-600">{purchaseMessage}</p>}
            {purchaseError && <p className="mt-2 text-xs text-red-600">{purchaseError}</p>}
          </div>
        )}
        <div className="flex gap-4 pt-4">
          {isAdmin && (
            <Link
              to={`/admin/${product.id}`}
              className="rounded bg-primary px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-blue-600"
            >
              Editar produto
            </Link>
          )}
          <Link
            to="/catalog"
            className="rounded border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            Voltar
          </Link>
        </div>
      </div>
    </div>
  );
}
