'use client';

import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { usuario } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Bienvenido, {usuario?.nombre}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-gray-600 text-sm font-bold mb-2">ROL</h2>
          <p className="text-2xl font-bold text-blue-600">
            {usuario?.rol === 'admin' ? 'Administrador' : 
             usuario?.rol === 'cliente' ? 'Cliente' :
             usuario?.rol === 'entrenador' ? 'Entrenador' :
             'Recepcionista'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-gray-600 text-sm font-bold mb-2">EMAIL</h2>
          <p className="text-lg font-semibold text-gray-700">{usuario?.email}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-gray-600 text-sm font-bold mb-2">MIEMBRO DESDE</h2>
          <p className="text-lg font-semibold text-gray-700">
            {usuario?.creado ? new Date(usuario.creado).toLocaleDateString('es-ES') : '-'}
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/productos" className="block p-4 bg-blue-50 rounded hover:bg-blue-100 text-blue-600 font-bold">
            → Ver Productos
          </a>
          <a href="/clases" className="block p-4 bg-green-50 rounded hover:bg-green-100 text-green-600 font-bold">
            → Ver Clases
          </a>
          <a href="/carrito" className="block p-4 bg-purple-50 rounded hover:bg-purple-100 text-purple-600 font-bold">
            → Mi Carrito
          </a>
          <a href="/mis-suscripciones" className="block p-4 bg-orange-50 rounded hover:bg-orange-100 text-orange-600 font-bold">
            → Mi Suscripción
          </a>
        </div>
      </div>
    </div>
  );
}