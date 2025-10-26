import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import ProductForm from '../components/ProductForm';
import type { Product } from '../types/product';

export default function AdminPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) {
        setProduct(undefined);
        return;
      }

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

  function handleBackToCatalog() {
    navigate('/catalog');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{id ? 'Editar produto' : 'Cadastrar produto'}</h1>
          <p className="text-sm text-slate-600">
            {id
              ? 'Atualize as informações do produto selecionado.'
              : 'Preencha o formulário para adicionar um novo produto ao catálogo.'}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/catalog"
            className="rounded border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            Voltar ao catálogo
          </Link>
          {id && (
            <button
              type="button"
              onClick={async () => {
                if (!id) return;
                if (!confirm('Tem certeza que deseja remover este produto?')) return;
                try {
                  await api.delete(`/api/products/${id}`);
                  navigate('/catalog');
                } catch (err: any) {
                  setError(err?.response?.data?.error?.message ?? 'Erro ao remover produto.');
                }
              }}
              className="rounded border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
            >
              Remover produto
            </button>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {isLoading && <p className="text-sm text-slate-600">Carregando dados...</p>}

      {!isLoading && <ProductForm product={product} />}

      <div className="rounded border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
        <p className="font-semibold">Dica para QA:</p>
        <p>
          Utilize esta página para validar fluxos de criação, edição e exclusão de produtos. Os campos possuem validações
          alinhadas com o backend e exibem mensagens claras.
        </p>
      </div>

      <div>
        <button
          type="button"
          onClick={handleBackToCatalog}
          className="rounded bg-primary px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-blue-600"
        >
          Ver catálogo
        </button>
      </div>
    </div>
  );
}
