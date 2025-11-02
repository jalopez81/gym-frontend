'use client'
import { Typography } from '@mui/material'

interface TituloProps {
  title: string
  subtitle?: string
}

export default function MainTitle({ title, subtitle }: TituloProps) {
  return (
    <>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: subtitle ? 0.5 : 2 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="subtitle1" color="primary" sx={{ mb: 3, fontStyle: 'italic' }}>
          {subtitle}
        </Typography>
      )}
    </>
  )
}
