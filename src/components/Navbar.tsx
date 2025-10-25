'use client';

import { useAuthStore } from '@/store/authStore';
import LogoutIcon from '@mui/icons-material/Logout';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function ButtonAppBar() {
  const usuario = useAuthStore(s => s.usuario);
  const logout = useAuthStore(s => s.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };
  return (
    <AppBar position="static" sx={{background: "#a43f4a"}}>
      <Box sx={{ display: 'flex', justifyContent: "space-between" }}>
        <Box></Box>
        <Toolbar sx={{ minHeight: "56px !important"}}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1">
              {usuario && `Hola, ${usuario.nombre}!`}
            </Typography>
            {usuario ?
              <Button
                color="inherit"
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
              >
                Salir
              </Button> :
              <Button variant='text' size='small' color='secondary' onClick={()=> router.push('/login')}>Acceder</Button>
            }
          </Box>
        </Toolbar>
      </Box>
    </AppBar>
  );
}