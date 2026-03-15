'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
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
  Stack,
  CircularProgress
} from '@mui/material';
import apiClient from '@/utils/apiClient';

export default function RegistroPage() {
  // Estados de formulario
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [codigoGeneradoHash, setCodigoGeneradoHash] = useState('');
  const [codigoRecibido, setCodigoRecibido] = useState('');

  const [error, setError] = useState('');
  const [pasoVerificacion, setPasoVerificacion] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { registro } = useAuth();
  const router = useRouter();

  const handleSolicitarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      const res = await apiClient.post('/auth/enviar-codigo-registro', { email, nombre });
      setCodigoGeneradoHash(res.data.codigoGeneradoHash);

      setCodigoRecibido('');
      setPasoVerificacion(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.mensaje || 'Error al procesar la solicitud');
    } finally {
      setIsLoading(false);
    }
  };


  const handleVerificarYRegistrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await registro(nombre, email, password, codigoRecibido, codigoGeneradoHash);
      router.push('/dashboard');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.mensaje || 'Error al registrarse');
      console.log(err)
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
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom fontWeight="bold">
            {pasoVerificacion ? 'Verificar Correo' : 'Crear Cuenta'}
          </Typography>

          <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
            {pasoVerificacion
              ? `Introduce el código que enviamos a ${email}`
              : 'Completa tus datos para comenzar'}
          </Typography>

          {/* Formulario de Datos Iniciales */}
          {!pasoVerificacion ? (
            <Box component="form" onSubmit={handleSolicitarCodigo}>
              <Stack spacing={2.5}>
                <TextField
                  label="Nombre Completo"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  fullWidth
                  required
                  autoComplete="name"
                />
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
                  autoComplete="new-password"
                />
                <TextField
                  label="Confirmar Contraseña"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  fullWidth
                  required
                  autoComplete="new-password"
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={isLoading}
                  sx={{ py: 1.5, fontWeight: 'bold' }}
                >
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Siguiente'}
                </Button>
              </Stack>
            </Box>
          ) : (
            /* Formulario de Verificación de Código */
            <Box component="form" onSubmit={handleVerificarYRegistrar}>
              <Stack spacing={2.5}>
                <TextField
                  label="Código de Confirmación"
                  placeholder="Ej: A1B2C3"
                  value={codigoRecibido}
                  onChange={(e) => setCodigoRecibido(e.target.value)}
                  fullWidth
                  required
                  autoFocus
                  inputProps={{ style: { textAlign: 'center', fontSize: '1.2rem', letterSpacing: '4px' } }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={isLoading}
                  sx={{ py: 1.5, fontWeight: 'bold' }}
                >
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Confirmar y Registrarse'}
                </Button>

                <Button
                  variant="text"
                  fullWidth
                  onClick={() => setPasoVerificacion(false)}
                  disabled={isLoading}
                >
                  Volver a editar mis datos
                </Button>
              </Stack>
            </Box>
          )}

          {/* Mensajes de Error */}
          {error && (
            <Alert severity="error" sx={{ mt: 3, borderRadius: 1 }}>
              {error}
            </Alert>
          )}

          {/* Footer de Navegación */}
          <Typography align="center" sx={{ mt: 4 }}>
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" style={{ color: '#1976d2', fontWeight: 'bold', textDecoration: 'none' }}>
              Iniciar Sesión
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}