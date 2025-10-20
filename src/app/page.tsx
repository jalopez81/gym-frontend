'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

   if (isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center">
      <Navbar />
      <div className="text-center text-white">
        <h1 className="text-5xl font-bold mb-4">Bienvenido a Gym Manager</h1>
        <p className="text-xl mb-8">Gestiona tu entrenamiento y suscripción</p>

        <div className="space-x-4 flex flex-col">
          <Link
            href="/login"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/registro"
             className="bg-blue-400 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-300"
          >
            Registrarse
          </Link>
        </div>
      </div>
    </div>
  );
}