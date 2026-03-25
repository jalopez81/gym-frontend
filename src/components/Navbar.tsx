'use client';

import { useAuthStore } from '@/store/authStore';
import LogoutIcon from '@mui/icons-material/Logout';
import { AppBar, Box, Button, Toolbar, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
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

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleLanguageChange = (_event: React.MouseEvent<HTMLElement>, newLocale: string | null) => {
    if (newLocale && newLocale !== locale) {
      // Preserve the pathname, but change the language context
      router.replace(pathname, { locale: newLocale as "en" | "es" });
    }
  };
  return (
    <AppBar position="static" sx={{ background: "#a43f4a", position: "sticky", top: 0, zIndex: 10 }}>
      <Box sx={{ display: 'flex', justifyContent: "space-between" }}>
        <Box></Box>
        <Toolbar sx={{ minHeight: "56px !important" }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1">
              {usuario && t('greeting', { name: usuario.nombre })}
            </Typography>
            {usuario ?
              <Button
                color="inherit"
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
              >
                {t('logout')}
              </Button> :
              <Button variant='text' size='small' color='secondary' onClick={() => router.push('/login')}>{t('login')}</Button>
            }
            <ToggleButtonGroup
              value={locale}
              exclusive
              onChange={handleLanguageChange}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.3)',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                  '&.Mui-selected': {
                    color: '#a43f4a',
                    backgroundColor: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.9)',
                    },
                  },
                  padding: '4px 12px',
                  fontSize: '0.875rem',
                },
              }}
            >
              <ToggleButton value="es"><ReactCountryFlag countryCode="es" svg/><span style={{ marginLeft: "0.5rem" }}/>ES</ToggleButton>
              <ToggleButton value="en"><ReactCountryFlag countryCode="us" svg/><span style={{ marginLeft: "0.5rem" }}/>EN</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Toolbar>
      </Box>
    </AppBar>
  );
}