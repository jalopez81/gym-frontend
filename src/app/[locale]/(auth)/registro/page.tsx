'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
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
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('Register');

  const handleSolicitarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('errorMismatch'));
      return;
    }

    if (password.length < 6) {
      setError(t('errorLength'));
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
            {pasoVerificacion ? t('verifyTitle') : t('title')}
          </Typography>

          <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
            {pasoVerificacion
              ? t('verifySubtitle', { email })
              : t('subtitle')}
          </Typography>

          {/* Formulario de Datos Iniciales */}
          {!pasoVerificacion ? (
            <Box component="form" onSubmit={handleSolicitarCodigo}>
              <Stack spacing={2.5}>
                <TextField
                  label={t('fullName')}
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  fullWidth
                  required
                  autoComplete="name"
                />
                <TextField
                  label={t('email')}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  required
                  autoComplete="email"
                />
                <TextField
                  label={t('password')}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  required
                  autoComplete="new-password"
                />
                <TextField
                  label={t('confirmPassword')}
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
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : t('next')}
                </Button>
              </Stack>
            </Box>
          ) : (
            /* Formulario de Verificación de Código */
            <Box component="form" onSubmit={handleVerificarYRegistrar}>
              <Stack spacing={2.5}>
                <TextField
                  label={t('confirmCode')}
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
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : t('confirmAndRegister')}
                </Button>

                <Button
                  variant="text"
                  fullWidth
                  onClick={() => setPasoVerificacion(false)}
                  disabled={isLoading}
                >
                  {t('backToEdit')}
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
            {t('hasAccount')}{' '}
            <Link href="/login" style={{ color: '#1976d2', fontWeight: 'bold', textDecoration: 'none' }}>
              {t('login')}
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}