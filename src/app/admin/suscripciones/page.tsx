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

export default function SuscripcionesPage() {
    const [suscripciones, setSuscripciones] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    const cargar = async () => {
        try {
            const res = await apiClient.get('/suscripciones')
            setSuscripciones(res.data)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { cargar() }, [])

    if (loading) return <CircularProgress />

    const filtradas = suscripciones.filter(
        (s) =>
            s.usuario.nombre.toLowerCase().includes(search.toLowerCase()) ||
            s.plan.nombre.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" mb={2}>Suscripciones</Typography>
            <TextField
                label="Buscar por usuario o plan"
                variant="outlined"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
                sx={{ mb: 3 }}
            />

            {!filtradas.length ? (
                <Typography>No hay resultados</Typography>
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Usuario</TableCell>
                            <TableCell>Plan</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Vence</TableCell>
                            <TableCell>Acción</TableCell>
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
                                        Cancelar
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
