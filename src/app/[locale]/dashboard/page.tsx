'use client';

import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActionArea,
  Avatar,
} from '@mui/material';
import {
  ShoppingBag,
  FitnessCenter,
  ShoppingCart,
  CardMembership,
  PersonOutline,
  EmailOutlined,
  EventAvailableOutlined
} from '@mui/icons-material';
import { Link } from "@/i18n/routing";
import { useAuthStore } from '@/store/authStore';
import MyContainer from '@/components/MyContainer';
import { useTranslations } from 'next-intl';
import { useBreakpoints } from '@/utils/useMediaQuery';
import AdminReportSummary from './AdminReportSummary';

export default function DashboardPage() {
  const usuario = useAuthStore(s => s.usuario);
  const ROLES = useAuthStore(s => s.ROLES);
  const isAdmin = usuario?.rol === ROLES.ADMIN;
  const t = useTranslations('Dashboard');
  const { isMobile } = useBreakpoints();

  const actions = [
    { descKey: 'products' as const, title: t('actions.products'), icon: <ShoppingBag fontSize="large" />, href: '/productos', color: '#1976d2' },
    { descKey: 'classes' as const, title: t('actions.classes'), icon: <FitnessCenter fontSize="large" />, href: '/clases', color: '#2e7d32' },
    { descKey: 'cart' as const, title: t('actions.cart'), icon: <ShoppingCart fontSize="large" />, href: '/carrito', color: '#9c27b0' },
    { descKey: 'subscription' as const, title: t('actions.subscription'), icon: <CardMembership fontSize="large" />, href: '/suscripciones', color: '#ed6c02' }
  ];

  const statCards = [
    { 
      label: t('role'), 
      value: usuario?.rol || '-', 
      icon: <PersonOutline color="primary" />, 
      gradient: 'linear-gradient(135deg, #fff 0%, #f0f7ff 100%)' 
    },
    { 
      label: t('email'), 
      value: usuario?.email || '-', 
      icon: <EmailOutlined color="primary" />, 
      gradient: 'linear-gradient(135deg, #fff 0%, #fdf0ff 100%)' 
    },
    { 
      label: t('memberSince'), 
      value: usuario?.creado ? new Date(usuario.creado).toLocaleDateString() : '-', 
      icon: <EventAvailableOutlined color="primary" />, 
      gradient: 'linear-gradient(135deg, #fff 0%, #f0fff4 100%)' 
    }
  ];

  return (
    <MyContainer className="page-dashboard" isAuthGuard={true} sx={{ py: 4 }}>
      {/* hero */}
      <Box sx={{ mb: 6, textAlign: isMobile ? 'center' : 'left' }}>
        <Typography variant={isMobile ? "h4" : "h3"} fontWeight="800" sx={{ color: '#333', mb: 1 }}>
          {t('welcome', { name: usuario?.nombre || '' })} 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('subtitle', { defaultMessage: 'Ready for your workout today?' })}
        </Typography>
      </Box>

      {/*  QUICK ACTIONS  */}
      <Typography variant="h5" gutterBottom fontWeight="800" sx={{ mb: 3, textAlign: isMobile ? 'center' : 'left' }}>
        {t('quickActions')}
      </Typography>

      <Grid container spacing={3}>
        {actions.map((action) => (
          <Grid item xs={12} sm={6} md={3} mb={6} key={action.descKey}>
            <Card 
              elevation={0}
              sx={{ 
                borderRadius: 4, 
                border: '1px solid #f0f0f0',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
                  borderColor: action.color
                }
              }}
            >
              <CardActionArea component={Link} href={action.href} sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center', py: 5 }}>
                  <Box 
                    sx={{ 
                      display: 'inline-flex',
                      p: 2,
                      borderRadius: '50%',
                      bgcolor: `${action.color}15`,
                      color: action.color,
                      mb: 2,
                      transition: '0.3s'
                    }}
                    className="icon-container"
                  >
                    {action.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: '#2c3e50' }}>
                    {action.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t(`actionDesc.${action.descKey}`)}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {isAdmin ? <AdminReportSummary /> : null}
    </MyContainer>
  );
}