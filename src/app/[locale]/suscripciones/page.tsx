'use client'
import { useEffect, useState } from 'react'
import { Box, Card, CardContent, Typography, Button, CircularProgress, Stack, Divider } from '@mui/material'
import apiClient from '@/utils/apiClient'
import MyContainer from '@/components/MyContainer'
import MainTitle from '@/components/MainTitle'

import Planes from '../planes/page'
import { useRouter } from "@/i18n/routing";
import { EstadoSuscripcion, Suscripcion } from '@/types'


export default function MiSuscripcionPage() {
  const [suscripcion, setSuscripcion] = useState<Suscripcion | null>(null)
  const [loading, setLoading] = useState(true)
  const [modoCambiarPlan, setModoCambiarPlan] = useState(false)
  const router = useRouter();

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

  // const cambiarPlan = async (nuevoPlanId: string) => {
  //   if (!suscripcion) return
  //   await apiClient.patch(`/suscripciones/${suscripcion.id}`, { planId: nuevoPlanId })
  //   setModoCambiarPlan(false)
  //   cargar()
  // }

  useEffect(() => {
    cargar()
  }, [])

  const getSuscripcionEstadoLabel = (estado: string) => {
    switch (estado) {
      case EstadoSuscripcion.ACTIVA:
        return { label: 'Activa', color: 'green' }
      case EstadoSuscripcion.CANCELADA:
        return { label: 'Cancelada', color: 'orange' }
      case EstadoSuscripcion.VENCIDA:
        return { label: 'Vencida', color: 'red' }
      default:
        return { label: estado, color: 'grey' }
    }
  }

  if (loading) return <CircularProgress />

  if (!suscripcion) router.push('/planes')

  if (modoCambiarPlan)
    return <Planes />

  return (
    <MyContainer className="suscripciones-container" isAuthGuard={true}>
      <MainTitle title="Mis Suscripciones" />

      <Card
        sx={{
          maxWidth: 400,
          margin: '20px auto',
          background: 'linear-gradient(135deg, #fff5f5, #ffeaea)',
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        {suscripcion && (<CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ mb: 0.5 }}>
                {suscripcion.plan.nombre}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                Precio: ${suscripcion.plan.precio.toFixed(2)}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                Duración: {suscripcion.plan.duracionDias} días
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                Inicia: {new Date(suscripcion.fechaInicio).toLocaleDateString()}
              </Typography>
              <Typography variant="body2">
                Vence: {new Date(suscripcion.fechaVencimiento).toLocaleDateString()}
              </Typography>
            </Box>

            <Typography
              variant="h6"
              sx={{
                color: getSuscripcionEstadoLabel(suscripcion.estado).color,
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
              }}
            >
              {getSuscripcionEstadoLabel(suscripcion.estado).label}
            </Typography>
          </Box>

          <Divider sx={{ my: 1.5 }} />
          
          <Typography variant="body2" sx={{ textAlign: 'center', mb: 1, fontWeight: '500', my: 4 }}>
            {suscripcion.plan.beneficios}
          </Typography>

          <Stack direction="row" spacing={2} mt={2} justifyContent="center">
            {suscripcion.estado === EstadoSuscripcion.ACTIVA && (
              <Button variant="contained" color="error" onClick={cancelar}>
                Cancelar
              </Button>
            )}
            <Button variant="contained" color="secondary" onClick={() => setModoCambiarPlan(true)}>
              Cambiar
            </Button>
            {suscripcion.estado === EstadoSuscripcion.VENCIDA || suscripcion.estado === EstadoSuscripcion.CANCELADA && (
              <Button variant="contained" color="primary" onClick={renovar}>
                Renovar
              </Button>
            )}
          </Stack>
        </CardContent>          
        )}
      </Card>
    </MyContainer>
  )
}
