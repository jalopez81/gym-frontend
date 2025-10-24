"use client"; 

import { ProductCard } from "@/components/product-card";
import apiClient from "@/utils/apiClient";
import { listarProductos } from "@/services/productos";
import { Producto } from "@/types";
import {
  Box,
  CircularProgress,
  Grid,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";


export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProductos() {
      setLoading(true);
      setError(null);
      try {
        const response = await listarProductos();
        const data = response.data.productos;
        setProductos(data)
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProductos();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Listado de Productos
      </Typography>
      <Box className="products-container" 
      sx={{
        display: 'flex', 
        flexWrap: "wrap",
        justifyContent: 'space-evenly',
        gap: 3
      }}
      >
        {productos.map((producto) => (
          <Grid item xs={12} sm={6} md={4} key={producto.id}>
            <ProductCard producto={producto} />
          </Grid>
        ))}
      </Box>
    </Box>
  );
}