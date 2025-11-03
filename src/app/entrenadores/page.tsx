'use client'

import { useEffect, useState } from 'react'
import apiClient from '@/utils/apiClient'
import { Box, Card, CardContent, Typography, Grid, Avatar, CircularProgress, Divider, Button, Tooltip } from '@mui/material'
import { CldImage } from 'next-cloudinary';
import MyContainer from '@/components/MyContainer';
import MainTitle from '@/components/MainTitle';
import { Clase } from '@/types';

export default function EntrenadoresPage() {
  const [entrenadores, setEntrenadores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEntrenadores = async () => {
      try {
        const res = await apiClient.get('/entrenadores')
        setEntrenadores(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchEntrenadores()
  }, [])

  const clasesList = (clases: any) => {
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>{clases?.map((clase: any) => (
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: '#ffffff',
          color: '#000000',
          padding: 1
        }}>
          <Typography variant="body1" sx={{fontWeight: 'bold'}}>{clase.nombre}</Typography>
          <Typography variant="subtitle2">{clase.duracion} minutos</Typography>
          <Typography variant="overline">Capacidad: {clase.capacidad} </Typography>
          <Button size="small">Inscribirse</Button>
        </Box>
      ))}
      </Box>)
  }

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    )

  return (
    <MyContainer sx={{ background: "#eeeeee" }}>
      <MainTitle title="Entrenadores" subtitle="Conoce a nuestros entrenadores y sus especialidades" />

      <Box sx={{ display: 'flex' }}>
        {entrenadores.map(ent => (
          <Box key={ent.id} sx={{ display: 'flex' }}>
            <Card sx={{
              p: 2,
              width: 360,
              m: 1
            }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                <CldImage src={ent.usuario.imagenSecureUrl} width={110} height={110} crop="fill" gravity="faces" quality="auto" alt="Entrenador" loading="lazy" radius={200} />
                <Typography variant="h6">{ent.usuario.nombre}</Typography>
                <Typography variant="body2">{ent.usuario.email}</Typography>
                <Box className="divider" sx={{ borderBottom: 'solid 1px #cecece', width: '100%', marginY: 1 }}></Box>
                <Typography variant="body2">{ent.especialidad}</Typography>
                <Typography variant="body2">{ent.experiencia} años de experiencia</Typography>
                <Typography variant="body2">{ent.certificaciones}</Typography>

                <Tooltip title={clasesList(ent.clases)} sx={{ background: "#ffffff" }}>
                  <Button variant='text' sx={{ m: 1 }}>Ver clases</Button>
                </Tooltip>
              </Box>
            </Card>
          </Box>
        ))}
      </Box>
    </MyContainer>
  )
}
