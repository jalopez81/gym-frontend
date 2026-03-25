'use client'

import { useEffect, useState } from 'react'
import { Box, Button, IconButton, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import apiClient from '@/utils/apiClient'
import { formatDateTime } from '@/utils'
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslations } from 'next-intl';

interface Backup {
  id: string
  nombre: string
  fecha: string
  tamaño: string
}

export default function AdminBackups() {
  const [backups, setBackups] = useState<Backup[]>([])
  const [loading, setLoading] = useState(false)
  const t = useTranslations('AdminBackups');

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
    alert(t('restored'))
  }
  
  const handleEliminar = async (id: string) => {
    if (!confirm(t('confirmDelete'))) return
    const res = await apiClient.delete(`/backups/${id}/eliminar`)
    if(res.status === 200){
      setBackups(backups.filter(b=> b.id !== id));
    }    
  }

  useEffect(() => {
    fetchBackups()
  }, [])

  const columnas: GridColDef<Backup>[] = [
    { field: 'nombre', headerName: t('name'), flex: 1 },
    { field: 'fecha', headerName: t('date'), flex: 1, valueGetter: (value) => formatDateTime(value) },
    { field: 'tamaño', headerName: t('size'), flex: 1 },
    {
      field: 'acciones',
      headerName: t('actions'),
      flex: 1,
      renderCell: (params) => (
        <>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleRestaurar(params.row.id)}
          sx={{ m: 1}}
        >
          {t('restoreButton')}
        </Button>
        <IconButton onClick={() => handleEliminar(params.row.id)}><DeleteIcon /></IconButton>
        </>
      ),
    },
  ]

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        {t('title')}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleCrear}
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {loading ? t('creating') : t('createButton')}
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

