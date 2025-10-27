'use client';

import Link from 'next/link';
import { Box, Typography, Button, Container, Paper } from '@mui/material';

export default function CheckoutSuccessPage() {
  return (
    <Box sx={{ minHeight: '100vh', py: 4, background: '#f5f5f5', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            ¡Pago realizado con éxito!
          </Typography>
          <Typography variant="body1" gutterBottom>
            Gracias por tu compra. Tu pedido se ha procesado correctamente.
          </Typography>
          <Link href="/productos" passHref>
            <Button variant="contained" color="primary">
              Volver a productos
            </Button>
          </Link>
        </Paper>
      </Container>
    </Box>
  );
}
