import { FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth, getRedirectForRole } from '../contexts/AuthContext';
import { Roles, type Role } from '../types/auth';

interface LoginPageProps {
  role: Role;
}

const DEFAULT_CREDENTIALS = {
  [Roles.ADMIN]: {
    email: 'admin@petbuddy.com',
    password: 'admin123'
  },
  [Roles.BUYER]: {
    email: 'cliente@petbuddy.com',
    password: 'cliente123'
  }
} as const;

export default function LoginPage({ role }: LoginPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState<string>(DEFAULT_CREDENTIALS[role].email);
  const [password, setPassword] = useState<string>(DEFAULT_CREDENTIALS[role].password);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await login({ email, password, expectedRole: role });
      const target = (location.state as { from?: { pathname: string } } | null)?.from?.pathname;
      navigate(target ?? getRedirectForRole(role), { replace: true });
    } catch (err: any) {
      const message = err?.response?.data?.error?.message ?? err?.message ?? 'Falha no login.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-8 text-slate-900">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-primary">{role === Roles.ADMIN ? 'Login do administrador' : 'Login do comprador'}</h1>
        <p className="mt-2 text-sm text-slate-600">
          {role === Roles.ADMIN
            ? 'Acesse o painel administrativo para gerenciar o catálogo.'
            : 'Entre para explorar e comprar os produtos do catálogo.'}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="usuario@petbuddy.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-75"
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 rounded border border-dashed border-slate-300 p-4 text-xs text-slate-600">
          <p className="font-semibold">Credenciais padrão:</p>
          <ul className="mt-2 space-y-1">
            <li>
              <span className="font-medium">Admin:</span> admin@petbuddy.com / admin123
            </li>
            <li>
              <span className="font-medium">Comprador:</span> cliente@petbuddy.com / cliente123
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
