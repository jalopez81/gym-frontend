'use client';

import MyContainer from '@/components/MyContainer';
import { useAuthStore } from '@/store/authStore';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import Image from 'next/image';
import { Link } from "@/i18n/routing";
import { useRouter } from "@/i18n/routing";
import { useEffect, useState } from 'react'; 
import { useTranslations } from 'next-intl';

export default function Home() {
  const usuario = useAuthStore((s) => s.usuario);
  const router = useRouter();
  const [rehidrated, setRehydrated] = useState(false);
  const t = useTranslations('Index');

  useEffect(() => {
    setRehydrated(true)
  }, []);

  useEffect(() => {
    if (usuario) router.push("/dashboard");
  }, [usuario, router]);

  return (
    <MyContainer
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'        
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center' }}>
          <Image src="/logo-big-png.png" alt="logo" width={300} height={300} />
          <Typography variant="h5" gutterBottom sx={{ mb: 4 }} color="GrayText">
            {t('title')}
          </Typography>

            <Stack direction="row" spacing={2} justifyContent="center" 
            sx={{ 
              opacity: rehidrated && !usuario ? 1: 0,
              transform: rehidrated && !usuario ? 'translateY(-10px)' :'translateY(0)',
              transition: 'all 300ms ease-in'
            }}
            >
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  size="large"
                >
                  {t('login')}
                </Button>
              </Link>
              <Link href="/registro" style={{ textDecoration: 'none' }}>
                <Button
                  variant="outlined"
                  size="large"
                >
                  {t('register')}
                </Button>
              </Link>
            </Stack>
        </Box>
      </Container>
    </MyContainer>
  );
}