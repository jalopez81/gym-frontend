'use client'
import { useEffect, useState } from 'react'
import {
    Box,
    Button,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material'
import apiClient from '@/utils/apiClient'
import { Suscripcion } from '@/types'
import { useTranslations } from 'next-intl'

export default function SuscripcionesPage() {
    const [suscripciones, setSuscripciones] = useState<Suscripcion[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const t = useTranslations('AdminSubscriptions')

    const cargar = async () => {
        try {
            const res = await apiClient.get('/suscripciones')
            setSuscripciones(res.data)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { cargar() }, [])

    if (loading) return <CircularProgress sx={{ margin: '0 auto'}} />

    const filtradas = suscripciones.filter(
        (s: Suscripcion) =>
            s.usuario.nombre.toLowerCase().includes(search.toLowerCase()) ||
            s.plan.nombre.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" mb={2}>{t('title')}</Typography>
            <TextField
                label={t('searchLabel')}
                variant="outlined"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
                sx={{ mb: 3 }}
            />

            {!filtradas.length ? (
                <Typography>{t('noResults')}</Typography>
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('user')}</TableCell>
                            <TableCell>{t('plan')}</TableCell>
                            <TableCell>{t('status')}</TableCell>
                            <TableCell>{t('expires')}</TableCell>
                            <TableCell>{t('action')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filtradas.map((s) => (
                            <TableRow key={s.id}>
                                <TableCell>{s.usuario.nombre}</TableCell>
                                <TableCell>{s.plan.nombre}</TableCell>
                                <TableCell>{s.estado}</TableCell>
                                <TableCell>{new Date(s.fechaVencimiento).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={async () => {
                                            await apiClient.patch(`/suscripciones/${s.id}/cancelar`)
                                            cargar()
                                        }}
                                    >
                                        {t('cancelButton')}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </Box>
    )
}
