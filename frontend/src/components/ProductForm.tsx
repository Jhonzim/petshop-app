import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { Product } from '../types/product';

interface ProductFormProps {
  product?: Product;
}

const categories = ['Rações', 'Acessórios', 'Higiene', 'Brinquedos', 'Medicamentos (OTC)'];

interface FormValues {
  name: string;
  sku: string;
  category: string;
  price: string;
  stock: string;
  description: string;
  imageUrl: string;
}

const initialValues: FormValues = {
  name: '',
  sku: '',
  category: '',
  price: '',
  stock: '',
  description: '',
  imageUrl: ''
};

export default function ProductForm({ product }: ProductFormProps) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      setValues({
        name: product.name,
        sku: product.sku,
        category: product.category,
        price: String(product.price),
        stock: String(product.stock),
        description: product.description,
        imageUrl: product.imageUrl
      });
    } else {
      setValues(initialValues);
    }
  }, [product]);

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function validate(): boolean {
    const validationErrors: Record<string, string> = {};

    if (!values.name || values.name.length < 3) {
      validationErrors.name = 'O nome deve ter pelo menos 3 caracteres.';
    }
    if (!values.sku || values.sku.length < 3) {
      validationErrors.sku = 'O SKU deve ter pelo menos 3 caracteres.';
    }
    if (!values.category) {
      validationErrors.category = 'Selecione uma categoria.';
    }
    if (!values.price || Number(values.price) <= 0) {
      validationErrors.price = 'Informe um preço maior que zero.';
    }
    if (!values.stock || Number(values.stock) < 0) {
      validationErrors.stock = 'Informe um estoque maior ou igual a zero.';
    }
    if (!values.description || values.description.length < 10) {
      validationErrors.description = 'A descrição deve ter pelo menos 10 caracteres.';
    }
    if (!values.imageUrl) {
      validationErrors.imageUrl = 'Informe uma URL de imagem válida.';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const payload = {
        name: values.name,
        sku: values.sku,
        category: values.category,
        price: Number(values.price),
        stock: Number(values.stock),
        description: values.description,
        imageUrl: values.imageUrl
      };

      if (product) {
        await api.put(`/api/products/${product.id}`, payload);
        setFeedback('Produto atualizado com sucesso!');
      } else {
        const response = await api.post('/api/products', payload);
        navigate(`/products/${response.data.id}`);
        return;
      }
    } catch (error: any) {
      const message = error?.response?.data?.error?.message ?? 'Erro ao salvar produto.';
      setFeedback(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="name">
            Nome
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
            className="rounded border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="sku">
            SKU
          </label>
          <input
            id="sku"
            name="sku"
            type="text"
            value={values.sku}
            onChange={handleChange}
            className="rounded border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {errors.sku && <p className="text-xs text-red-600">{errors.sku}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="category">
            Categoria
          </label>
          <select
            id="category"
            name="category"
            value={values.category}
            onChange={handleChange}
            className="rounded border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-xs text-red-600">{errors.category}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="price">
            Preço (R$)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={values.price}
            onChange={handleChange}
            className="rounded border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {errors.price && <p className="text-xs text-red-600">{errors.price}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="stock">
            Estoque
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            value={values.stock}
            onChange={handleChange}
            className="rounded border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {errors.stock && <p className="text-xs text-red-600">{errors.stock}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="imageUrl">
            URL da imagem
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            value={values.imageUrl}
            onChange={handleChange}
            className="rounded border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {errors.imageUrl && <p className="text-xs text-red-600">{errors.imageUrl}</p>}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700" htmlFor="description">
          Descrição
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={values.description}
          onChange={handleChange}
          className="rounded border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        {errors.description && <p className="text-xs text-red-600">{errors.description}</p>}
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center rounded bg-primary px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Salvando...' : product ? 'Atualizar produto' : 'Cadastrar produto'}
        </button>
        {feedback && <span className="text-sm text-slate-600">{feedback}</span>}
      </div>
    </form>
  );
}
