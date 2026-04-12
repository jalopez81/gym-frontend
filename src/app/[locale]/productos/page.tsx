"use client";

import MyContainer from "@/components/MyContainer";
import { CircularProgress, Typography } from "@mui/material";
import ProductoGrid from "./ProductoGrid";
import { useProductos } from "@/hooks/useProductos";
import Searchbar from "./searchbar";
import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

function ProductosPageContent() {
  const searchParams = useSearchParams();
  const { productos, pagination, setPagination, loading, error } = useProductos();
  const lastBusquedaParam = useRef<string | undefined>(undefined);

  useEffect(() => {
    const q = searchParams.get("busqueda") ?? undefined;
    if (q === lastBusquedaParam.current) return;
    lastBusquedaParam.current = q;
    if (!q) return;
    setPagination((prev) => ({ ...prev, busqueda: q, pagina: 1 }));
  }, [searchParams, setPagination]);

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

export default function ProductosPage() {
  return (
    <Suspense fallback={<CircularProgress sx={{ margin: "2rem auto", display: "block" }} />}>
      <ProductosPageContent />
    </Suspense>
  );
}
