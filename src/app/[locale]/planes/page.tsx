'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent, Typography, Button, CircularProgress, Box } from '@mui/material'
import apiClient from '@/utils/apiClient'
import { useRouter } from "@/i18n/routing";
import MyContainer from '@/components/MyContainer'
import MainTitle from '@/components/MainTitle'
import { Plan } from '@/types'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useTranslations } from 'next-intl'

export default function Planes() {
  const [planes, setPlanes] = useState<Plan[]>([])
  const [suscripcionId, setSuscripcionId] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const t = useTranslations('Plans')

  const cargarPlanes = async () => {
    try {
      const resPlanes = await apiClient.get('/planes')
      const resSuscripciones = await apiClient.get('/suscripciones/mi-suscripcion')
      setPlanes(resPlanes.data)
      setSuscripcionId(resSuscripciones.data?.planId)
    } finally {
      setLoading(false)
    }
  }

  const suscribirse = async (planId: string) => {
    await apiClient.post('/suscripciones', { planId })
    router.push('/suscripciones')
  }

  useEffect(() => {
    cargarPlanes()
  }, [])

  if (loading) return <CircularProgress sx={{ margin: '0 auto' }} />

  return (
    <MyContainer isAuthGuard={true}>
      <MainTitle
        title={t('title')}
        subtitle={t('subtitle')}
      />
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {planes.map((plan: Plan) => (
          <Card key={plan.id} sx={{ width: 400, m: 2, position: "relative", background: suscripcionId === plan.id ? '#fbf5e2' : '#ffeaea' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
              <Box className="plan-details">
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {plan.nombre}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 1 }}>
                  {plan.descripcion}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>{t('duration')}:</strong> {plan.duracionDias} {t('days')}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>{t('benefits')}:</strong> {plan.beneficios}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                  ${plan.precio}
                </Typography>
              </Box>
              <Typography variant="h6" color="primary" sx={{ mt: 1, position: 'absolute', top: "-1.5rem", right: "1rem", fontSize: "4rem", fontWeight: 'bold', opacity: 0.2 }}>
                {plan.nivel}
              </Typography>

              {suscripcionId !== plan.id && (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => suscribirse(plan.id)}
                >
                  {t('subscribeButton')}
                </Button>
              )}
              {suscripcionId === plan.id && (
                <CheckCircleOutlineIcon sx={{ color: 'green', transform: 'translateY(5px)', fontSize: '5rem' }} />

              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </MyContainer>
  )
}
