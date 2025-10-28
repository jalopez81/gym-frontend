'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Grid,
  Alert,
  Snackbar,
  Paper,
  Divider
} from '@mui/material';
import { useRouter } from 'next/navigation';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import { useCartStore } from '@/store/cartStore';

export default function PaymentPage() {
  const router = useRouter();
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
    focus: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const items = useCartStore(s => s.items);
  const clear = useCartStore(s => s.clear);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let t = 0;
    items.forEach(item => t += item.producto.precio * item.cantidad);
    setTotal(t);
  }, [items]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces every 4 digits
    if (name === 'number') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }
    // Format expiry date as MM/YY
    if (name === 'expiry') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d{0,2})/, '$1/$2')
        .slice(0, 5);
    }
    // Limit CVC to 3-4 digits
    if (name === 'cvc') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setCardData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setCardData(prev => ({
      ...prev,
      focus: e.target.name
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      setShowSuccess(true);
      clear();
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    }, 1500);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 4, px: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Pago con Tarjeta de Crédito
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mt: 4 }}>
            <CardContent>
              <Box sx={{ mb: 4 }}>
                <Cards
                  number={cardData.number}
                  expiry={cardData.expiry}
                  cvc={cardData.cvc}
                  name={cardData.name}
                  focused={cardData.focus as any}
                />
              </Box>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Número de Tarjeta"
                      name="number"
                      value={cardData.number}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                      placeholder="1234 5678 9012 3456"
                      inputProps={{ maxLength: 19 }}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Nombre en la Tarjeta"
                      name="name"
                      value={cardData.name}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                      placeholder="JUAN PEREZ"
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Fecha de Vencimiento"
                      name="expiry"
                      value={cardData.expiry}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                      placeholder="MM/YY"
                      inputProps={{ maxLength: 5 }}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="CVC"
                      name="cvc"
                      value={cardData.cvc}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                      placeholder="123"
                      inputProps={{ maxLength: 4 }}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      size="large"
                      sx={{ mt: 2 }}
                    >
                      Pagar ${total.toFixed(2)}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Resumen del Pedido
            </Typography>

            <Box sx={{ my: 2 }}>
              {items.map(item => (
                <Box key={item.producto.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    {item.producto.nombre} x{item.cantidad}
                  </Typography>
                  <Typography variant="body2">
                    ${(item.producto.precio * item.cantidad).toFixed(2)}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Total a Pagar
              </Typography>
              <Typography variant="subtitle1" fontWeight="bold">
                ${total.toFixed(2)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={showSuccess}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          ¡Pago procesado exitosamente!
        </Alert>
      </Snackbar>
    </Box>
  );
}