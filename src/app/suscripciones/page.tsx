'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent, Typography, Button, CircularProgress, Stack } from '@mui/material'
import apiClient from '@/utils/apiClient'
import SeleccionarPlan from './seleccionar-plan'

export default function MiSuscripcionPage() {
  const [suscripcion, setSuscripcion] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  const cargar = async () => {
    try {
      const res = await apiClient.get('/suscripciones/mi-suscripcion')
      setSuscripcion(res.data)
    } catch {
      setSuscripcion(null)
    } finally {
      setLoading(false)
    }
  }

  const cancelar = async () => {
    if (!suscripcion) return
    await apiClient.delete(`/suscripciones/${suscripcion.id}`)
    cargar()
  }

  const renovar = async () => {
    if (!suscripcion) return
    await apiClient.post(`/suscripciones/${suscripcion.id}/renovar`, {
      planId: suscripcion.plan.id,
    })
    cargar()
  }

  useEffect(() => {
    cargar()
  }, [])

  if (loading) return <CircularProgress />

  if (!suscripcion) {
    return (
      <>
        <Typography>No tienes una suscripción activa</Typography>
        <SeleccionarPlan />
      </>
    )
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{suscripcion.plan.nombre}</Typography>
        <Typography>Precio: ${suscripcion.plan.precio}</Typography>
        <Typography>Estado: {suscripcion.estado}</Typography>
        <Typography>
          Vence: {new Date(suscripcion.fechaVencimiento).toLocaleDateString()}
        </Typography>

        <Stack direction="row" spacing={2} mt={2}>
          <Button variant="outlined" color="error" onClick={cancelar}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={renovar}>
            Renovar
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}
