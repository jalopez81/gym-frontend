'use client';

import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Box, TableContainer } from '@mui/material';
import ProductoRow from '@/app/[locale]/admin/productos/ProductoRow'; 
import { Producto } from '@/types';
import { useBreakpoints } from '@/utils/useMediaQuery';
import ProductoCardMobile from '../admin/productos/ProductoCardMobile';

interface Props {
    productos: Producto[];
    fetchProductos: () => void;
    pagination: any;
    setPagination: any;
}

export default function ProductoTable({ productos, fetchProductos }: Props) {
    const { isMobile } = useBreakpoints();

    if (isMobile) {
        return (
            <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {productos.map((p) => (
                    <ProductoCardMobile key={p.id} producto={p} refresh={fetchProductos} />
                ))}
            </Box>
        );
    }

    return (
        <TableContainer component={Paper} sx={{ mt: 3, p: 2 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Imagen</TableCell>
                        <TableCell align="right">Precio</TableCell>
                        <TableCell>Stock</TableCell>
                        <TableCell>Categoría</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {productos.map((p) => (
                        <ProductoRow key={p.id} producto={p} refresh={fetchProductos} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}