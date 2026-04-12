"use client";

import MyContainer from "@/components/MyContainer";
import { CircularProgress, Typography } from "@mui/material";
import ProductoGrid from "./ProductoGrid";
import { useProductos } from "@/hooks/useProductos";
import Searchbar from "./searchbar";
import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

function ProductosPageContent() {
  const searchParams = useSearchParams();
  const t = useTranslations("Products");
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

      {!loading && productos.length === 0 ? (
        <Typography color="text.secondary" sx={{ mt: 3, textAlign: "center", px: 2 }}>
          {pagination.busqueda?.trim()
            ? t("noSearchResults", { query: pagination.busqueda.trim() })
            : t("noProducts")}
        </Typography>
      ) : null}

      {!loading && productos.length > 0 ? (
        <ProductoGrid productos={productos} pagination={pagination} setPagination={setPagination}/>
      ) : null}
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
