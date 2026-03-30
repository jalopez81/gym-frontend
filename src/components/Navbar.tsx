'use client';

import { useAuthStore } from '@/store/authStore';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import { 
  AppBar, 
  Box, 
  Button, 
  Toolbar, 
  Typography, 
  ToggleButton, 
  ToggleButtonGroup, 
  Container,
  Tooltip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useRouter, usePathname } from "@/i18n/routing";
import { useLocale, useTranslations } from 'next-intl';
import ReactCountryFlag from "react-country-flag";

export default function ButtonAppBar() {
  const usuario = useAuthStore(s => s.usuario);
  const logout = useAuthStore(s => s.logout);
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('Navbar');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleLanguageChange = (_event: React.MouseEvent<HTMLElement>, newLocale: string | null) => {
    if (newLocale && newLocale !== locale) {
      router.replace(pathname, { locale: newLocale as "en" | "es" });
    }
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        background: "#a43f4a", 
        top: 0, 
        zIndex: 5, 
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(8px)', // Trendy touch
      }}
    >
      <Container maxWidth="xl">
        {/* Changed to flex-end since left side is now empty (Logo is in sidebar) */}
        <Toolbar disableGutters sx={{ minHeight: "64px", justifyContent: 'flex-end' }}>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 3 } }}>
            
            {/* Greeting */}
            {usuario && !isMobile && (
              <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                {t('greeting', { name: usuario.nombre })}
              </Typography>
            )}

            {/* Auth Button */}
            {usuario ? (
              <Tooltip title={t('logout')}>
                <Button
                  color="inherit"
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                  size={isMobile ? "small" : "medium"}
                  sx={{ 
                    textTransform: 'none',
                    borderRadius: '8px',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  {!isMobile && t('logout')}
                </Button>
              </Tooltip>
            ) : (
              <Button 
                color="inherit" 
                variant="outlined"
                size="small"
                onClick={() => router.push('/login')}
                startIcon={<LoginIcon />}
                sx={{ 
                  borderColor: 'rgba(255,255,255,0.5)', 
                  textTransform: 'none',
                  borderRadius: '8px'
                }}
              >
                {t('login')}
              </Button>
            )}

            {/* Vertical Divider */}
            <Box sx={{ width: '1px', height: '24px', bgcolor: 'rgba(255,255,255,0.2)' }} />

            {/* Language Switcher */}
            <ToggleButtonGroup
              value={locale}
              exclusive
              onChange={handleLanguageChange}
              size="small"
              sx={{
                bgcolor: 'rgba(0,0,0,0.15)',
                borderRadius: '8px',
                p: '2px',
                '& .MuiToggleButton-root': {
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px !important',
                  px: 1.5,
                  transition: 'all 0.2s ease',
                  '&.Mui-selected': {
                    color: '#a43f4a',
                    backgroundColor: 'white',                    
                    '&:hover': { backgroundColor: '#f0f0f0' },
                  },
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                },
              }}
            >
              <ToggleButton value="es" aria-label="Spanish">
                <ReactCountryFlag countryCode="es" svg />
                {!isMobile && <Typography variant="caption" sx={{ ml: 1, fontWeight: 600 }}>ES</Typography>}
              </ToggleButton>
              <ToggleButton value="en" aria-label="English">
                <ReactCountryFlag countryCode="us" svg />
                {!isMobile && <Typography variant="caption" sx={{ ml: 1, fontWeight: 600 }}>EN</Typography>}
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}