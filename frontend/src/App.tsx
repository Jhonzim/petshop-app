import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Roles } from './types/auth';

export default function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks: Array<{ to: string; label: string }> = [];

  if (user?.role === Roles.BUYER) {
    navLinks.push({ to: '/catalog', label: 'Catálogo' });
  }

  if (user?.role === Roles.ADMIN) {
    navLinks.push({ to: '/catalog', label: 'Catálogo' });
    navLinks.push({ to: '/admin/dashboard', label: 'Admin' });
  }

  function handleLogout() {
    if (!user) return;
    const redirect = user.role === Roles.ADMIN ? '/admin' : '/';
    logout();
    navigate(redirect, { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <NavLink to={user?.role === Roles.ADMIN ? '/admin/dashboard' : '/catalog'} className="text-xl font-semibold text-primary">
            PetBuddy Catalog
          </NavLink>
          <nav className="flex items-center gap-4 text-sm font-medium">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded px-3 py-2 transition-colors ${
                    isActive ? 'bg-primary text-white' : 'text-slate-600 hover:text-primary'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {user && (
              <div className="flex items-center gap-2">
                <span className="hidden text-xs text-slate-500 sm:inline">{user.name}</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Sair
                </button>
              </div>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
