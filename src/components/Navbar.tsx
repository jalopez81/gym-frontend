'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { usuario, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/dashboard" className="text-2xl font-bold">
          Gym  Manager
        </Link>

        {isAuthenticated && (
          <div className="flex items-center space-x-4">
            <span className="text-sm">Hola, {usuario?.nombre}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}