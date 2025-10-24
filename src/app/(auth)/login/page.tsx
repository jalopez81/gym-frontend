'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  Stack
} from '@mui/material';
import { useAuthStore } from '@/store/authStore';
import {syncCart} from '@/utils/syncCart'

export default function LoginPage() {
  const [email, setEmail] = useState('admin@gym.com');
  const [password, setPassword] = useState('6!80Us0((^eJD^G6E#^bQ&24');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore(s => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);      
      await syncCart()
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.mensaje || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom fontWeight="bold">
            Iniciar Sesión
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                autoComplete="email"
              />

              <TextField
                label="Contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                autoComplete="current-password"
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </Stack>
          </Box>

          <Typography align="center" sx={{ mt: 3 }}>
            ¿No tienes cuenta?{' '}
            <Link href="/registro" style={{ color: '#1976d2', fontWeight: 'bold' }}>
              Registrarse
            </Link>
          </Typography>

          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="subtitle2" fontWeight="bold">
              Cuentas de prueba:
            </Typography>
            <Typography variant="body2">Admin: admin@gym.com / admin123</Typography>
            <Typography variant="body2">Cliente: juan@gym.com / 123456</Typography>
          </Alert>
        </Paper>
      </Container>
    </Box>
  );
}