import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CatalogPage from './pages/CatalogPage';
import ProductPage from './pages/ProductPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import ProtectedLayout from './components/ProtectedLayout';
import { AuthProvider } from './contexts/AuthContext';
import { Roles } from './types/auth';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage role={Roles.BUYER} />
  },
  {
    path: '/admin',
    element: <LoginPage role={Roles.ADMIN} />
  },
  {
    path: '/',
    element: <ProtectedLayout allowedRoles={[Roles.BUYER, Roles.ADMIN]} />,
    children: [
      { path: 'catalog', element: <CatalogPage /> },
      { path: 'products/:id', element: <ProductPage /> }
    ]
  },
  {
    path: '/admin',
    element: <ProtectedLayout allowedRoles={[Roles.ADMIN]} />,
    children: [
      { path: 'dashboard', element: <AdminPage /> },
      { path: ':id', element: <AdminPage /> }
    ]
  },
  { path: '*', element: <Navigate to="/" replace /> }
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
