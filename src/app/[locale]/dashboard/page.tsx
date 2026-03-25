'use client';

import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActionArea
} from '@mui/material';
import {
  ShoppingBag,
  FitnessCenter,
  ShoppingCart,
  CardMembership
} from '@mui/icons-material';
import { Link } from "@/i18n/routing";
import { useAuthStore } from '@/store/authStore';
import MyContainer from '@/components/MyContainer';
import { useTranslations } from 'next-intl';

export default function DashboardPage() {
  const usuario = useAuthStore( s=> s.usuario);
  const t = useTranslations('Dashboard');

  const getRolLabel = (rol: string) => {
    return rol;
  };

  const actions = [
    { title: t('actions.products'), icon: <ShoppingBag fontSize="large" />, href: '/productos', color: '#1976d2' },
    { title: t('actions.classes'), icon: <FitnessCenter fontSize="large" />, href: '/clases', color: '#2e7d32' },
    { title: t('actions.cart'), icon: <ShoppingCart fontSize="large" />, href: '/carrito', color: '#9c27b0' },
    { title: t('actions.subscription'), icon: <CardMembership fontSize="large" />, href: '/suscripciones', color: '#ed6c02' }
  ];

  return (
    <MyContainer className="page-dashboard" isAuthGuard={true}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        {t('welcome', { name: usuario?.nombre || '' })}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="overline" color="text.secondary" fontWeight="bold">
              {t('role')}
            </Typography>
            <Typography variant="h5" color="primary" fontWeight="bold">
              {usuario?.rol && getRolLabel(usuario.rol)}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="overline" color="text.secondary" fontWeight="bold">
              {t('email')}
            </Typography>
            <Typography variant="h6" color="text.primary">
              {usuario?.email}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="overline" color="text.secondary" fontWeight="bold">
              {t('memberSince')}
            </Typography>
            <Typography variant="h6" color="text.primary">
              {usuario?.creado ? new Date(usuario.creado).toLocaleDateString('es-ES') : '-'}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
        {t('quickActions')}
      </Typography>

      <Grid container spacing={3}>
        {actions.map((action) => (
          <Grid item xs={12} sm={6} md={3} key={action.title}>
            <Card>
              <CardActionArea component={Link} href={action.href}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Box sx={{ color: action.color, mb: 2 }}>
                    {action.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold">
                    {action.title}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </MyContainer>
  );
}