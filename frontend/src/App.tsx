import { NavLink, Outlet } from 'react-router-dom';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <NavLink to="/" className="text-xl font-semibold text-primary">
            PetBuddy Catalog
          </NavLink>
          <nav className="flex gap-4 text-sm font-medium">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `rounded px-3 py-2 transition-colors ${
                  isActive ? 'bg-primary text-white' : 'text-slate-600 hover:text-primary'
                }`
              }
            >
              Catálogo
            </NavLink>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `rounded px-3 py-2 transition-colors ${
                  isActive ? 'bg-primary text-white' : 'text-slate-600 hover:text-primary'
                }`
              }
            >
              Admin
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
