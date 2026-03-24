'use client';

import { Link } from "@/i18n/routing";
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { useTranslations } from 'next-intl';

export default function CheckoutSuccessPage() {
  const t = useTranslations('CheckoutSuccess');

  return (
    <Box sx={{ minHeight: '100vh', py: 4, background: '#f5f5f5', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            {t('title')}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {t('message')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
            <Link href="/productos" passHref>
              <Button variant="contained" color="primary">
                {t('backToProducts')}
              </Button>
            </Link>
            <Link href="/mis-ordenes" passHref>
              <Button variant="contained" color="primary">
                {t('orders')}
              </Button>
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
