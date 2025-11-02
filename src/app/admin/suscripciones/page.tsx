'use client'
import { useEffect, useState } from 'react'
import { Button, Card, CardContent, Typography, CircularProgress, Stack } from '@mui/material'
import apiClient from '@/utils/apiClient'

export default function SuscripcionesPage() {
    const [suscripciones, setSuscripciones] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const cargar = async () => {
        try {
            const res = await apiClient.get('/suscripciones')
            setSuscripciones(res.data)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        cargar()
    }, [])

    if (loading) return <CircularProgress />

    return (
        <Stack spacing={2}>
            {suscripciones.map((s) => (
                <Card key={s.id}>
                    <CardContent>
                        <Typography variant="h6">{s.usuario.nombre}</Typography>
                        <Typography>{s.plan.nombre}</Typography>
                        <Typography>Estado: {s.estado}</Typography>
                        <Typography>Vence: {new Date(s.fechaVencimiento).toLocaleDateString()}</Typography>
                    </CardContent>
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

                </Card>
            ))}
        </Stack>
    )
}