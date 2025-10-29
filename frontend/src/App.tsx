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
      <header className="sticky top-0 z-50 bg-white/80 shadow-sm backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <NavLink 
            to={user?.role === Roles.ADMIN ? '/admin/dashboard' : '/catalog'} 
            className="flex items-center gap-2 text-xl font-bold text-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7m16 0V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7m16 0H2m4 3h.01M12 15h.01M20 15h.01M4 15h.01M12 15h.01M20 15h.01" />
            </svg>
            PetBuddy Catalog
          </NavLink>
          <nav className="flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative rounded-lg px-3 py-2 transition-all ${
                    isActive 
                      ? 'bg-primary/10 text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary after:content-[""]' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-primary'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {user && (
              <div className="flex items-center gap-4 pl-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="hidden text-sm font-medium text-slate-700 sm:inline">{user.name}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-primary"
                >
                  Sair
                </button>
              </div>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
