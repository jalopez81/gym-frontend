"use client";

import { ProductoCard } from "@/components/product-card";
import { Producto, ProductPagination } from "@/types";
import {
    Box,
    Grid, Pagination
} from '@mui/material';
import { Dispatch, SetStateAction } from "react";

type ProductoGridProps = {
    productos: Producto[];
    pagination: ProductPagination;
    setPagination: Dispatch<SetStateAction<ProductPagination>>
}

export default function ProductoGrid({ productos, pagination, setPagination }: ProductoGridProps) {
    return (<>
        <Box className="products-container"
            sx={{
                display: 'flex',
                flexWrap: "wrap",
                justifyContent: 'flex-start',
                gap: 3
            }}
        >
            {productos.map((producto) => (
                <Grid item xs={12} sm={6} md={4} key={producto.id}>
                    <ProductoCard producto={producto} />
                </Grid>
            ))}
        </Box>
        <Box sx={{ width: "100%", display: 'flex', justifyContent: "center", margin: "1rem 0" }}>
            <Pagination
                count={pagination?.totalPaginas || 1}
                page={pagination.pagina}
                onChange={(e, value) => setPagination(prev => {
                    return { ...prev, pagina: value }
                })}
            />
        </Box>
    </>)
}