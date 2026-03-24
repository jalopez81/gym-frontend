'use client';

import Searchbar from '@/app/[locale]/productos/searchbar';
import { useProductos } from '@/hooks/useProductos';
import { Button, Container } from '@mui/material';
import { useEffect, useState } from 'react';
import ProductoTable from '../../productos/ProductoTable';
import CrearProducto from './CrearProducto';
import { useTranslations } from 'next-intl';   

export default function AdminProductosPage() {
    const [openCrear, setOpenCrear] = useState(false);
    const { productos, pagination, setPagination, fetchProductos } = useProductos();
    const t = useTranslations('AdminProducts');

    useEffect(() => {
        fetchProductos();
    }, [pagination.pagina, pagination.limite, pagination.busqueda, fetchProductos])

    return (
        <Container sx={{ py: 4 }}>
            <Searchbar pagination={pagination} setPagination={setPagination} />
            <Button variant="contained" color="primary" onClick={() => setOpenCrear(true)}>{t('createButton')}</Button>
            <ProductoTable
                productos={productos}
                fetchProductos={fetchProductos}
                pagination={pagination}
                setPagination={setPagination}
            />
            {openCrear && <CrearProducto onClose={() => { setOpenCrear(false); fetchProductos(); }} />}
        </Container>
    );
}
