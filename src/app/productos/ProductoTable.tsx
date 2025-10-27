'use client';

import { Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import ProductoRow from '../admin/productos/ProductoRow';
import { Producto } from '@/types';

type ProductoTableProps = {
    productos: Producto[];
    fetchProductos: () => void
}

export default function ProductoTable({ productos, fetchProductos }: ProductoTableProps) {
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
        </Paper>)
}