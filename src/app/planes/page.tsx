'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent, Typography, Button, CircularProgress, Box } from '@mui/material'
import apiClient from '@/utils/apiClient'
import { useRouter } from 'next/navigation'
import MyContainer from '@/components/MyContainer'
import MainTitle from '@/components/MainTitle'

export default function Planes({ onSelectPlan }: { onSelectPlan?: (planId: string) => void }) {
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
    if (onSelectPlan) {
      onSelectPlan(planId)
      return
    }
    await apiClient.post('/suscripciones', { planId })
    router.push('/suscripciones')
  }

  useEffect(() => {
    cargarPlanes()
  }, [])

  if (loading) return <CircularProgress />

  return (
    <MyContainer isAuthGuard={true}>
      <MainTitle
        title={onSelectPlan ? 'Cambiar Plan' : 'Seleccionar Plan'}
        subtitle={onSelectPlan ? 'Elige tu nuevo plan de suscripción' : 'Elige el plan de suscripción que mejor se adapte a tus objetivos'}
      />
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {planes.map((plan) => (
          <Card key={plan.id} sx={{ width: 400, m: 2, position: "relative", background: '#ffeaea' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
              <Box className="plan-details">
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {plan.nombre}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 1 }}>
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
              </Box>
              <Typography variant="h6" color="primary" sx={{ mt: 1, position: 'absolute', top: "-1.5rem", right: "1rem", fontSize: "4rem", fontWeight: 'bold', opacity: 0.2 }}>
                {plan.nivel}
              </Typography>

              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => suscribirse(plan.id)}
              >
                {onSelectPlan ? 'Seleccionar' : 'Suscribirme'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </MyContainer>
  )
}
