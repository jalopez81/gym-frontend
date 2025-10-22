'use client';

import { Box, Container, Typography, Button, Stack } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

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
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            💪 Gimnasio App
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
            Gestiona tu entrenamiento y suscripción
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="center">
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