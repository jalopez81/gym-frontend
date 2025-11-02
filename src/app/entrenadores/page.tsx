'use client'

import { useEffect, useState } from 'react'
import apiClient from '@/utils/apiClient'
import { Box, Card, CardContent, Typography, Grid, Avatar, CircularProgress, Divider, Button } from '@mui/material'
import { CldImage } from 'next-cloudinary';
import MyContainer from '@/components/Container';
import MainTitle from '@/components/MainTitle';

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

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    )

  return (
    <MyContainer sx={{ background: "#eeeeee"}}>
      <MainTitle title="Entrenadores" subtitle="Conoce a nuestros entrenadores y sus especialidades"/>

      <Box sx={{ display: 'flex'}}>
        {entrenadores.map(ent => (
          <Box key={ent.id} sx={{ display: 'flex' }}>
            <Card sx={{
              p: 2,
              width: 360,
              m: 1
            }}>
              <Box
              sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'center'
              }}
              >
                <CldImage
                  src={ent.usuario.imagenSecureUrl}
                  width={110}
                  height={110}
                  crop="fill"
                  gravity="faces"
                  quality="auto"
                  alt="Entrenador"
                  loading="lazy"
                  radius={200}
                />
                <Typography variant="h6">{ent.usuario.nombre}</Typography>
                <Typography variant="body2">{ent.usuario.email}</Typography>
                
                <Box className="divider" sx={{ borderBottom: 'solid 1px #cecece', width: '100%', marginY: 1}}></Box>


                <Typography variant="body2">{ent.especialidad}</Typography>
                <Typography variant="body2">{ent.experiencia} años de experiencia</Typography>
                <Typography variant="body2">{ent.certificaciones}</Typography>
                <Button variant='outlined' sx={{m: 1}}>Ver clases</Button>
              </Box>
            </Card>
          </Box>
        ))}
      </Box>
    </MyContainer>
  )
}
