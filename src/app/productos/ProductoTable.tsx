'use client';

import { Producto, ProductPagination } from '@/types';
import { Box, Pagination, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Dispatch, SetStateAction } from "react";
import ProductoRow from '../admin/productos/ProductoRow';

type ProductoTableProps = {
    productos: Producto[];
    fetchProductos: () => void;
    pagination: ProductPagination;
    setPagination: Dispatch<SetStateAction<ProductPagination>>
}

export default function ProductoTable({ productos, fetchProductos, pagination, setPagination }: ProductoTableProps) {
    return (
        <Paper sx={{ mt: 3, p: 2 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Imagen</TableCell>
                        <TableCell>Precio</TableCell>
                        <TableCell>Stock</TableCell>
                        <TableCell>Categoria</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {productos.map((prod: any) => (
                        <ProductoRow key={prod.id} producto={prod} refresh={fetchProductos} />
                    ))}
                </TableBody>
            </Table>
            <Box sx={{ width: "100%", display: 'flex', justifyContent: "center", margin: "1rem 0" }}>
                <Pagination
                    count={pagination?.totalPaginas || 1}
                    page={pagination.pagina}
                    onChange={(e, value) => setPagination(prev => {
                        return { ...prev, pagina: value }
                    })}
                />
            </Box>
        </Paper>)
}