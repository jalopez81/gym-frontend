'use client'
import { useEffect, useState } from 'react'
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Paper,
    Chip,
    Divider,
    IconButton
} from '@mui/material'
import apiClient from '@/utils/apiClient'
import { Suscripcion } from '@/types'
import { useTranslations } from 'next-intl'
import LoadingAnimation from '@/components/LoadingAnimatino'
import { useBreakpoints } from '@/utils/useMediaQuery'
import CancelIcon from '@mui/icons-material/Cancel';

export default function SuscripcionesPage() {
    const { isMobile } = useBreakpoints()
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

    const handleCancelar = async (id: string) => {
        if (confirm(t('confirmCancel'))) { // Simple safety check
            await apiClient.patch(`/suscripciones/${id}/cancelar`)
            cargar()
        }
    }

    useEffect(() => { cargar() }, [])

    if (loading) { return <LoadingAnimation caption={t('loading')} /> }

    const filtradas = suscripciones.filter(
        (s: Suscripcion) =>
            s.usuario.nombre.toLowerCase().includes(search.toLowerCase()) ||
            s.plan.nombre.toLowerCase().includes(search.toLowerCase())
    )

    // Helper to color the status chips
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'activa': return 'success';
            case 'cancelada': return 'error';
            case 'vencida': return 'warning';
            default: return 'default';
        }
    }

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h5" mb={3} fontWeight="bold">
                {t('title')}
            </Typography>

            <TextField
                label={t('searchLabel')}
                variant="outlined"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
                size="small"
                sx={{ mb: 3, backgroundColor: 'white' }}
            />

            {!filtradas.length ? (
                <Typography color="text.secondary" align="center" mt={4}>
                    {t('noResults')}
                </Typography>
            ) : isMobile ? (
                /* MOBILE VIEW: Card Stack */
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {filtradas.map((s) => (
                        <Paper key={s.id} sx={{ p: 2, borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                <Box>
                                    <Typography fontWeight="bold">{s.usuario.nombre}</Typography>
                                    <Typography variant="body2" color="text.secondary">{s.plan.nombre}</Typography>
                                </Box>
                                <Chip 
                                    label={s.estado} 
                                    size="small" 
                                    color={getStatusColor(s.estado) as any} 
                                />
                            </Box>
                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="caption" color="text.secondary">
                                    {t('expires')}: {new Date(s.fechaVencimiento).toLocaleDateString()}
                                </Typography>
                                <Button 
                                    size="small" 
                                    color="error" 
                                    onClick={() => handleCancelar(s.id)}
                                    startIcon={<CancelIcon />}
                                >
                                    {t('cancelButton')}
                                </Button>
                            </Box>
                        </Paper>
                    ))}
                </Box>
            ) : (
                /* DESKTOP VIEW: Traditional Table */
                <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#f9f9f9' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>{t('user')}</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>{t('plan')}</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>{t('status')}</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>{t('expires')}</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>{t('action')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtradas.map((s) => (
                                <TableRow key={s.id} hover>
                                    <TableCell>{s.usuario.nombre}</TableCell>
                                    <TableCell>{s.plan.nombre}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={s.estado} 
                                            size="small" 
                                            variant="outlined" 
                                            color={getStatusColor(s.estado) as any} 
                                        />
                                    </TableCell>
                                    <TableCell>{new Date(s.fechaVencimiento).toLocaleDateString()}</TableCell>
                                    <TableCell align="right">
                                        <Button
                                            variant="text"
                                            color="error"
                                            size="small"
                                            onClick={() => handleCancelar(s.id)}
                                        >
                                            {t('cancelButton')}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            )}
        </Box>
    )
}