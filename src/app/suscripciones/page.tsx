'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent, Typography, Button, CircularProgress, Stack } from '@mui/material'
import apiClient from '@/utils/apiClient'
import SeleccionarPlan from './seleccionar-plan'
import MyContainer from '@/components/MyContainer'
import MainTitle from '@/components/MainTitle'
import AuthGuard from '@/components/AuthGuard'


export default function MiSuscripcionPage() {
  const [suscripcion, setSuscripcion] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [modoCambiarPlan, setModoCambiarPlan] = useState(false)

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
    await apiClient.patch(`/suscripciones/${suscripcion.id}/cancelar`)
    cargar()
  }

  const renovar = async () => {
    if (!suscripcion) return
    await apiClient.post(`/suscripciones/${suscripcion.id}/renovar`, {
      planId: suscripcion.plan.id,
    })
    cargar()
  }

  const cambiarPlan = async (nuevoPlanId: string) => {
    if (!suscripcion) return
    await apiClient.patch(`/suscripciones/${suscripcion.id}`, { planId: nuevoPlanId })
    setModoCambiarPlan(false)
    cargar()
  }

  useEffect(() => {
    cargar()
  }, [])

  if (loading) return <CircularProgress />

  // if (!suscripcion) return <SeleccionarPlan />

  if (modoCambiarPlan)
    return <SeleccionarPlan onSelectPlan={cambiarPlan} />

  return (
      <MyContainer className="suscripciones-container" isAuthGuard={true}>
        <MainTitle title='Mis Suscripciones' />
        <Card sx={{ width: 350 }}>
          <CardContent>
            <Typography variant="h6">{suscripcion.plan.nombre}</Typography>
            <Typography>Precio: ${suscripcion.plan.precio}</Typography>
            <Typography>Estado: {suscripcion.estado}</Typography>
            <Typography>
              Vence: {new Date(suscripcion.fechaVencimiento).toLocaleDateString()}
            </Typography>

            <Stack direction="row" spacing={2} mt={2} justifyContent="center" alignItems="center">
              <Button variant="outlined" color="error" onClick={cancelar}>
                Cancelar
              </Button>
              <Button variant="contained" onClick={renovar}>
                Renovar
              </Button>
              <Button variant="contained" color="secondary" onClick={() => setModoCambiarPlan(true)}>
                Cambiar
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </MyContainer>
  )
}
