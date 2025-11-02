'use client'
import { Typography } from '@mui/material'

interface TituloProps {
  texto: string
  subtitulo?: string
}

export default function Title({ texto, subtitulo }: TituloProps) {
  return (
    <>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: subtitulo ? 0.5 : 2 }}>
        {texto}
      </Typography>
      {subtitulo && (
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          {subtitulo}
        </Typography>
      )}
    </>
  )
}
