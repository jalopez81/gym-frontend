'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent, Typography, Button, Box, Grid } from '@mui/material'
import apiClient from '@/utils/apiClient'
import { useRouter } from "@/i18n/routing";
import MyContainer from '@/components/MyContainer'
import MainTitle from '@/components/MainTitle'
import { Plan } from '@/types'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useTranslations } from 'next-intl'
import LoadingAnimation from '@/components/LoadingAnimatino';

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

  if (loading) { return <LoadingAnimation caption={t('loading')} /> }

  return (
    <MyContainer isAuthGuard={true}>
      <MainTitle
        title={t('title')}
        subtitle={t('subtitle')}
      />
      
      {/* Use Grid container for automatic spacing and wrapping */}
      <Grid container spacing={3} justifyContent="center">
        {planes.map((plan: Plan) => (
          <Grid item xs={12} sm={6} md={4} key={plan.id}>
            <Card 
              sx={{ 
                height: '100%', // Ensures all cards in a row have equal height
                display: 'flex',
                flexDirection: 'column',
                position: "relative", 
                overflow: 'hidden', // Clips the large background number
                background: suscripcionId === plan.id ? '#fbf5e2' : '#ffeaea',
                border: suscripcionId === plan.id ? '2px solid #edcc61' : 'none',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.02)' }
              }}
            >
              <CardContent sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                height: '100%',
                pt: 4, // Space for the floating level number
                textAlign: 'center' 
              }}>
                <Box sx={{ flexGrow: 1, width: '100%' }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {plan.nombre}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 2, minHeight: '3em' }}>
                    {plan.descripcion}
                  </Typography>
                  
                  <Box sx={{ textAlign: 'left', mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>{t('duration')}:</strong> {plan.duracionDias} {t('days')}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>{t('benefits')}:</strong> {plan.beneficios}
                    </Typography>
                  </Box>
                  
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold', my: 2 }}>
                    ${plan.precio}
                  </Typography>
                </Box>

                {/* Decorative Level Number */}
                <Typography 
                  variant="h6" 
                  color="primary" 
                  sx={{ 
                    position: 'absolute', 
                    top: "-0.5rem", 
                    right: "0.5rem", 
                    fontSize: "4rem", 
                    fontWeight: 'bold', 
                    opacity: 0.1,
                    pointerEvents: 'none'
                  }}
                >
                  {plan.nivel}
                </Typography>

                <Box sx={{ mt: 'auto', pt: 2 }}>
                  {suscripcionId !== plan.id ? (
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      fullWidth
                      onClick={() => suscribirse(plan.id)}
                    >
                      {t('subscribeButton')}
                    </Button>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <CheckCircleOutlineIcon sx={{ color: 'green', fontSize: '3rem' }} />
                      <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold' }}>
                        {t('currentPlan')}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </MyContainer>
  )
}