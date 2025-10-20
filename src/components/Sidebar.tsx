'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const { usuario } = useAuth();
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  const esAdmin = usuario?.rol === 'admin';

  return (
    <aside className="w-64 bg-white shadow-lg h-screen overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800">Menú</h2>
      </div>

      <nav className="space-y-2 px-4">
        <Link
          href="/dashboard"
          className={`block px-4 py-2 rounded ${
            isActive('/dashboard')
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          📊 Dashboard
        </Link>

        <Link
          href="/productos"
          className={`block px-4 py-2 rounded ${
            isActive('/productos')
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          🛒 Productos
        </Link>

        <Link
          href="/clases"
          className={`block px-4 py-2 rounded ${
            isActive('/clases')
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          💪 Clases
        </Link>

        <Link
          href="/carrito"
          className={`block px-4 py-2 rounded ${
            isActive('/carrito')
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          🛍️ Carrito
        </Link>

        <Link
          href="/mis-ordenes"
          className={`block px-4 py-2 rounded ${
            isActive('/mis-ordenes')
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          📦 Mis Órdenes
        </Link>

        <Link
          href="/mis-suscripciones"
          className={`block px-4 py-2 rounded ${
            isActive('/mis-suscripciones')
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          📋 Suscripciones
        </Link>

        {esAdmin && (
          <>
            <hr className="my-4" />
            <p className="px-4 text-sm font-bold text-gray-600">ADMIN</p>

            <Link
              href="/admin/usuarios"
              className={`block px-4 py-2 rounded ${
                isActive('/admin/usuarios')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              👥 Usuarios
            </Link>

            <Link
              href="/admin/reportes"
              className={`block px-4 py-2 rounded ${
                isActive('/admin/reportes')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              📊 Reportes
            </Link>

            <Link
              href="/admin/backups"
              className={`block px-4 py-2 rounded ${
                isActive('/admin/backups')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              💾 Backups
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}