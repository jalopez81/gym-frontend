'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent, Typography, Button, Grid, CircularProgress, Box } from '@mui/material'
import apiClient from '@/utils/apiClient'
import { useRouter } from 'next/navigation'
import MyContainer from '@/components/Container'
import MainTitle from '@/components/MainTitle'

export default function SeleccionarPlan() {
  const [planes, setPlanes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const cargarPlanes = async () => {
    try {
      const res = await apiClient.get('/planes')
      setPlanes(res.data)
    } finally {
      setLoading(false)
    }
  }

  const suscribirse = async (planId: string) => {
    try {
      await apiClient.post('/suscripciones', { planId })
      router.push('/suscripciones')
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    cargarPlanes()
  }, [])

  if (loading) return <CircularProgress />

  return (
    <MyContainer className="seleccionar-plan-container">
      <MainTitle title="Seleccionar Plan" subtitle="Elige el plan de suscripción que mejor se adapte a tus objetivos"/>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {planes.map((plan) => (
          <Card sx={{
            width: 400,
            m: 2
          }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                {plan.nombre}
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                {plan.descripcion}
              </Typography>

              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Duración:</strong> {plan.duracionDias} días
              </Typography>

              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Beneficios:</strong> {plan.beneficios}
              </Typography>

              <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                ${plan.precio}
              </Typography>

              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => suscribirse(plan.id)}
              >
                Suscribirme
              </Button>
            </CardContent>

          </Card>
        ))}
      </Box>
    </MyContainer>
  )
}
