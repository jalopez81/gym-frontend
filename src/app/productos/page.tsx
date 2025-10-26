"use client";

import { ProductCard } from "@/components/product-card";
import { Pagination } from '@mui/material';
import { listarProductos } from "@/services/productos";
import { ProductPagination, Producto } from "@/types";
import {
  Box,
  CircularProgress,
  Grid,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import MyContainer from "@/components/Container";
import Searchbar from "./searchbar";

const defaultPagination: ProductPagination = {
  total: 0,
  pagina: 1,
  limite: 10,
  busqueda: "",
  totalPaginas: 0
};

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [pagination, setPagination] = useState<ProductPagination>(defaultPagination);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProductos() {
      setLoading(true);
      setError(null);
      try {
        const response = await listarProductos({
          pagina: pagination.pagina,
          limite: pagination.limite,
          busqueda: pagination.busqueda,
        });
        setProductos(response.data.productos);
        setPagination(((prev: ProductPagination) => {
          const { totalPaginas, total } = response.data.paginacion;
          return {
            ...prev,
            totalPaginas,
            total
          }

        }))
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProductos();
  }, [pagination.pagina, pagination.limite, pagination.busqueda]);
  ;

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <MyContainer className="page-productos" sx={{ background: "#f5f5f5" }}>
      <Searchbar pagination={pagination} setPagination={setPagination} />
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
      <Pagination
        count={pagination?.totalPaginas || 1}
        page={pagination.pagina}
        onChange={(e, value) => setPagination(prev => {
          return { ...prev, pagina: value }
        })}
      />
    </MyContainer>
  );
}