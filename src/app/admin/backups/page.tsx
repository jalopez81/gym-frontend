'use client'

import { useEffect, useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import apiClient from '@/utils/apiClient'
import { formatDateTime } from '@/utils'

interface Backup {
  id: string
  nombre: string
  fecha: string
  tamaño: string
}

export default function AdminBackups() {
  const [backups, setBackups] = useState<Backup[]>([])
  const [loading, setLoading] = useState(false)

  const fetchBackups = async () => {
    const res = await apiClient.get('/backups')
    setBackups(res.data.backups)
  }

  const handleCrear = async () => {
    setLoading(true)
    await apiClient.post('/backups/manual')
    await fetchBackups()
    setLoading(false)
  }

  const handleRestaurar = async (id: string) => {
    if (!confirm(`¿Restaurar backup ${id}?`)) return
    await apiClient.post(`/backups/${id}/restaurar`)
    alert('Base de datos restaurada exitosamente.')
  }

  useEffect(() => {
    fetchBackups()
  }, [])

  const columnas: GridColDef<Backup>[] = [
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    { field: 'fecha', headerName: 'Fecha', flex: 1, valueGetter: (v, r) => formatDateTime(r.fecha) },
    { field: 'tamaño', headerName: 'Tamaño', flex: 1 },
    {
      field: 'acciones',
      headerName: 'Acciones',
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleRestaurar(params.row.id)}
        >
          Restaurar
        </Button>
      ),
    },
  ]

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>Backups</Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleCrear}
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {loading ? 'Creando...' : 'Crear Backup'}
      </Button>

      <DataGrid
        rows={backups}
        columns={columnas}
        getRowId={(r) => r.id}
        pageSizeOptions={[5, 10]}
        initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
      />
    </Box>
  )
}
