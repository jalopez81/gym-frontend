'use client'
import { useEffect, useState } from 'react'
import { Box, Card, CardContent, Typography, Button, Stack, Divider } from '@mui/material'
import apiClient from '@/utils/apiClient'
import MyContainer from '@/components/MyContainer'
import MainTitle from '@/components/MainTitle'

import Planes from '../planes/page'
import { useRouter } from "@/i18n/routing";
import { EstadoSuscripcion, Suscripcion } from '@/types'
import { useTranslations } from 'next-intl';
import LoadingAnimation from '@/components/LoadingAnimatino'
import { useBreakpoints } from '@/utils/useMediaQuery';

export default function MiSuscripcionPage() {
  const [suscripcion, setSuscripcion] = useState<Suscripcion | null>(null)
  const [loading, setLoading] = useState(true)
  const [modoCambiarPlan, setModoCambiarPlan] = useState(false)
  const router = useRouter();
  const t = useTranslations('MySubscription');
  const { isMobile } = useBreakpoints();

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

  useEffect(() => {
    cargar()
  }, [])

  const getSuscripcionEstadoLabel = (estado: string) => {
    switch (estado) {
      case EstadoSuscripcion.ACTIVA:
        return { label: t('status.active'), color: 'green' }
      case EstadoSuscripcion.CANCELADA:
        return { label: t('status.cancelled'), color: 'orange' }
      case EstadoSuscripcion.VENCIDA:
        return { label: t('status.expired'), color: 'red' }
      default:
        return { label: estado, color: 'grey' }
    }
  }

  if (loading) { return <LoadingAnimation caption={t('loading')} /> }

  if (!suscripcion) {
    router.push('/planes');
    return null;
  }

  if (modoCambiarPlan) return <Planes />

  return (
    <MyContainer className="suscripciones-container" isAuthGuard={true}>
      <MainTitle title={t('title')} />

      <Card
        sx={{
          width: '100%',
          maxWidth: 500, // Slightly wider for better readability on desktop
          margin: '20px auto',
          background: 'linear-gradient(135deg, #fff5f5, #ffeaea)',
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between', 
              alignItems: isMobile ? 'center' : 'flex-start', 
              gap: 2,
              textAlign: isMobile ? 'center' : 'left'
            }}
          >
            <Box>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
                {suscripcion.plan.nombre}
              </Typography>
              <Typography variant="body1" sx={{ mb: 0.5 }}>
                {t('price')}: <b>**${suscripcion.plan.precio.toFixed(2)}**</b>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('duration')}: {suscripcion.plan.duracionDias} {t('days')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('starts')}: {new Date(suscripcion.fechaInicio).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('expires')}: {new Date(suscripcion.fechaVencimiento).toLocaleDateString()}
              </Typography>
            </Box>

            <Typography
              variant="h6"
              sx={{
                color: getSuscripcionEstadoLabel(suscripcion.estado).color,
                fontWeight: 'bold',
                backgroundColor: 'rgba(255,255,255,0.6)',
                px: 2,
                py: 0.5,
                borderRadius: 2,
                border: `1px solid ${getSuscripcionEstadoLabel(suscripcion.estado).color}`,
                whiteSpace: 'nowrap',
              }}
            >
              {getSuscripcionEstadoLabel(suscripcion.estado).label}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="body1" sx={{ textAlign: 'center', mb: 3, fontStyle: 'italic', px: 2 }}>
            {suscripcion.plan.beneficios}
          </Typography>

          <Stack 
            direction={isMobile ? "column" : "row"} 
            spacing={2} 
            mt={2} 
            justifyContent="center"
          >
            {suscripcion.estado === EstadoSuscripcion.ACTIVA && (
              <Button variant="contained" color="error" fullWidth={isMobile} onClick={cancelar}>
                {t('cancelButton')}
              </Button>
            )}
            
            <Button variant="contained" color="secondary" fullWidth={isMobile} onClick={() => setModoCambiarPlan(true)}>
              {t('changeButton')}
            </Button>

            {(suscripcion.estado === EstadoSuscripcion.VENCIDA || suscripcion.estado === EstadoSuscripcion.CANCELADA) && (
              <Button variant="contained" color="primary" fullWidth={isMobile} onClick={renovar}>
                {t('renewButton')}
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    </MyContainer>
  )
}