"use client";

import MyContainer from "@/components/Container";
import {
  CircularProgress,
  Typography
} from '@mui/material';
import ProductoGrid from "./ProductoGrid";
import Searchbar from "./searchbar";
import { useProductos } from "@/hooks/useProductos";

export default function ProductosPage() {
  const { productos, pagination, setPagination, loading, error, fetchProductos } = useProductos();

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <MyContainer className="page-productos" sx={{ background: "#f5f5f5", height: "100%", display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Searchbar pagination={pagination} setPagination={setPagination} />

      {loading && <CircularProgress />}

      {!loading && (
        <ProductoGrid productos={productos} pagination={pagination} setPagination={setPagination}/>
      )}
    </MyContainer>
  );
}