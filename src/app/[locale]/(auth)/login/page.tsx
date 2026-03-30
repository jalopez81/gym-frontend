'use client';

import { useState } from 'react';
import { useRouter } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  Stack,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { EmailOutlined, LockOutlined } from '@mui/icons-material';
import { useAuthStore } from '@/store/authStore';
import MyContainer from '@/components/MyContainer';
import MainTitle from '@/components/MainTitle';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@gym.com');
  const [password, setPassword] = useState('@dmIn1299');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore(s => s.login);
  const t = useTranslations('Login');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);      
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.mensaje || t('error'));
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
        // Athletic background gradient
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        px: 2
      }}
    >
      <MyContainer className="page-login" maxWidth="sm">
        <Paper 
          elevation={6} 
          sx={{ 
            p: { xs: 3, md: 5 }, 
            borderRadius: 4,
            textAlign: 'center' 
          }}
        >
          <MainTitle title={t('title')} subtitle={t('subtitle')} />
          
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={3}>
              <TextField
                label={t('email')}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                autoComplete="email"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label={t('password')}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                autoComplete="current-password"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isLoading}
                sx={{ 
                  py: 1.5, 
                  borderRadius: 2, 
                  fontWeight: 'bold', 
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : t('submit')}
              </Button>
            </Stack>
          </Box>

          <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #eee' }}>
            <Typography variant="body2" color="text.secondary">
              {t('noAccount')}{' '}
              <Link href="/registro" style={{ color: '#a43f4a', fontWeight: 'bold', textDecoration: 'none' }}>
                {t('register')}
              </Link>
            </Typography>
          </Box>
        </Paper>
      </MyContainer>
    </Box>
  );
}