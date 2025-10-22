'use client';

import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuthStore } from '@/store/authStore';

export default function Navbar() {
  const usuario = useAuthStore(s => s.usuario);
  const logout = useAuthStore(s => s.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!usuario) return null;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          💪 Gimnasio App
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body1">
            Hola, {usuario?.nombre}
          </Typography>
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
          >
            Salir
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}