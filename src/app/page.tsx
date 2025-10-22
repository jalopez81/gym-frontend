'use client';

import { useAuthStore } from '@/store/authStore';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const usuario = useAuthStore((s) => s.usuario);
  const [rehidrated, setRehydrated] = useState(false);

  useEffect(() => {
    setRehydrated(true)
  }, []);

  useEffect(() => {
    if (usuario) router.push("/dashboard");
  }, [usuario, router]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <img src="logo-big-png.png" alt="logo" style={{ width: 'auto', height: '300px'}} />
          <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
            Gestiona tu entrenamiento y suscripción
          </Typography>

            <Stack direction="row" spacing={2} justifyContent="center" 
            sx={{ 
              opacity: rehidrated && !usuario ? 1: 0,
              transform: rehidrated && !usuario ? 'translateY(-10px)' :'translateY(0)',
              transition: 'all 300ms ease-in'
            }}
            >
              <Button
                component={Link}
                href="/login"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'grey.100' }
                }}
              >
                Iniciar Sesión
              </Button>
              <Button
                component={Link}
                href="/registro"
                variant="outlined"
                size="large"
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                }}
              >
                Registrarse
              </Button>
            </Stack>
        </Box>
      </Container>
    </Box>
  );
}