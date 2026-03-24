"use client";

import MyContainer from "@/components/MyContainer";
import {
  CircularProgress,
  Typography
} from '@mui/material';
import ProductoGrid from "./ProductoGrid";
import Searchbar from "./searchbar";
import { useProductos } from "@/hooks/useProductos";

export default function ProductosPage() {
  const { productos, pagination, setPagination, loading, error } = useProductos();

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <MyContainer className="page-productos" sx={{ height: "100%", display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
      <Searchbar pagination={pagination} setPagination={setPagination} />

      {loading && <CircularProgress sx={{ margin: '0 auto'}} />}

      {!loading && (
        <ProductoGrid productos={productos} pagination={pagination} setPagination={setPagination}/>
      )}
    </MyContainer>
  );
}