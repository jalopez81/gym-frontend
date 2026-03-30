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
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
  IconButton
} from '@mui/material';
import { 
  PersonOutline, 
  EmailOutlined, 
  LockOutlined, 
  Visibility, 
  VisibilityOff,
  VerifiedUserOutlined 
} from '@mui/icons-material';
import apiClient from '@/utils/apiClient';
import { useTranslations } from 'next-intl';

export default function RegistroPage() {
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [codigoGeneradoHash, setCodigoGeneradoHash] = useState('');
  const [codigoRecibido, setCodigoRecibido] = useState('');

  const [error, setError] = useState('');
  const [pasoVerificacion, setPasoVerificacion] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { registro } = useAuth();
  const router = useRouter();
  const t = useTranslations('Register');

  const steps = [t('stepInfo'), t('stepVerify')];

  const handleSolicitarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) return setError(t('errorMismatch'));
    if (password.length < 6) return setError(t('errorLength'));

    setIsLoading(true);
    try {
      const res = await apiClient.post('/auth/enviar-codigo-registro', { email, nombre });
      setCodigoGeneradoHash(res.data.codigoGeneradoHash);
      setCodigoRecibido('');
      setPasoVerificacion(true);
    } catch (err: any) {
      setError(err.response?.data?.mensaje || t('errorRequest'));
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
    } catch (err: any) {
      setError(err.response?.data?.mensaje || t('errorRegister'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #a43f4a 0%, #2c3e50 100%)', // Using your brand colors
      py: 6, px: 2
    }}>
      <Container maxWidth="sm">
        <Paper elevation={10} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4 }}>
          
          {/* Visual Progress Stepper */}
          <Stepper activeStep={pasoVerificacion ? 1 : 0} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Typography variant="h4" component="h1" align="center" gutterBottom fontWeight="900">
            {pasoVerificacion ? t('verifyTitle') : t('title')}
          </Typography>

          <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 4 }}>
            {pasoVerificacion ? t('verifySubtitle', { email }) : t('subtitle')}
          </Typography>

          {!pasoVerificacion ? (
            /* STEP 1: INITIAL DATA */
            <Box component="form" onSubmit={handleSolicitarCodigo}>
              <Stack spacing={2.5}>
                <TextField
                  label={t('fullName')}
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  fullWidth required
                  InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutline /></InputAdornment> }}
                />
                <TextField
                  label={t('email')}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth required
                  InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlined /></InputAdornment> }}
                />
                <TextField
                  label={t('password')}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth required
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><LockOutlined /></InputAdornment>,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <TextField
                  label={t('confirmPassword')}
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  fullWidth required
                />

                <Button
                  type="submit" variant="contained" size="large" fullWidth
                  disabled={isLoading}
                  sx={{ py: 1.8, borderRadius: 2, fontWeight: 'bold', mt: 1 }}
                >
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : t('next')}
                </Button>
              </Stack>
            </Box>
          ) : (
            /* STEP 2: VERIFICATION */
            <Box component="form" onSubmit={handleVerificarYRegistrar}>
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <VerifiedUserOutlined sx={{ fontSize: 60, color: 'primary.main', mb: 1 }} />
                </Box>
                <TextField
                  label={t('confirmCode')}
                  placeholder="CODE"
                  value={codigoRecibido}
                  onChange={(e) => setCodigoRecibido(e.target.value.toUpperCase())}
                  fullWidth required autoFocus
                  inputProps={{ 
                    style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '8px', fontWeight: 'bold' },
                    maxLength: 6
                  }}
                  helperText={t('codeInstruction')}
                />

                <Button
                  type="submit" variant="contained" size="large" fullWidth
                  disabled={isLoading}
                  sx={{ py: 1.8, borderRadius: 2, fontWeight: 'bold' }}
                >
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : t('confirmAndRegister')}
                </Button>

                <Button
                  variant="text" fullWidth
                  onClick={() => setPasoVerificacion(false)}
                  disabled={isLoading}
                >
                  {t('backToEdit')}
                </Button>
              </Stack>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Typography align="center" sx={{ mt: 4, pt: 2, borderTop: '1px solid #eee' }}>
            {t('hasAccount')}{' '}
            <Link href="/login" style={{ color: '#a43f4a', fontWeight: 'bold', textDecoration: 'none' }}>
              {t('login')}
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}