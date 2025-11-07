'use client'

import MainTitle from '@/components/MainTitle';
import MyContainer from '@/components/MyContainer';
import apiClient from '@/utils/apiClient';
import { Box, Button, Card, CircularProgress, Tooltip, Typography } from '@mui/material';
import { CldImage } from 'next-cloudinary';
import { useEffect, useState } from 'react';
import EntrenadorCard from './EntrenadorCard';

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
    <MyContainer sx={{ background: "#eeeeee" }}>
      <MainTitle title="Entrenadores" subtitle="Conoce a nuestros entrenadores y sus especialidades" />

      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        {entrenadores.map(ent => <EntrenadorCard ent={ent} />)}
      </Box>
    </MyContainer>
  )
}
