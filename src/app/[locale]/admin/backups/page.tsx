'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  Box, 
  Button, 
  IconButton, 
  Typography, 
  Paper, 
  Stack, 
  Chip, 
  Divider,
  Tooltip,
  CircularProgress
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import apiClient from '@/utils/apiClient';
import { formatDateTime } from '@/utils';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useTranslations } from 'next-intl';
import { useBreakpoints } from '@/utils/useMediaQuery';
import MainTitle from '@/components/MainTitle';

interface Backup {
  id: string;
  nombre: string;
  fecha: string;
  tamaño: string;
}

export default function AdminBackups() {
  const { isMobile } = useBreakpoints();
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const t = useTranslations('AdminBackups');

  const fetchBackups = useCallback(async () => {
    try {
      setFetching(true);
      const res = await apiClient.get('/backups');
      setBackups(res.data.backups || []);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchBackups();
  }, [fetchBackups]);

  const handleCrear = async () => {
    setLoading(true);
    try {
      await apiClient.post('/backups/manual');
      await fetchBackups();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurar = async (backup: Backup) => {
    if (!confirm(t('confirmRestore', { name: backup.nombre }))) return;
    try {
      setLoading(true);
      await apiClient.post(`/backups/${backup.id}/restaurar`);
      alert(t('restored'));
    } catch (err) {
      alert("Error al restaurar");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id: string) => {
    if (!confirm(t('confirmDelete'))) return;
    try {
      const res = await apiClient.delete(`/backups/${id}/eliminar`);
      if (res.status === 200) {
        setBackups(prev => prev.filter(b => b.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const columnas: GridColDef<Backup>[] = [
    { 
      field: 'nombre', 
      headerName: t('name'), 
      flex: 1.5,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="medium">{params.value}</Typography>
      )
    },
    { 
      field: 'fecha', 
      headerName: t('date'), 
      flex: 1, 
      valueGetter: (_, row) => formatDateTime(row.fecha) 
    },
    { 
      field: 'tamaño', 
      headerName: t('size'), 
      width: 100,
      renderCell: (params) => <Chip label={params.value} size="small" variant="outlined" />
    },
    {
      field: 'acciones',
      headerName: t('actions'),
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center" height="100%">
          <Button
            size="small"
            variant="outlined"
            startIcon={<RestoreIcon />}
            onClick={() => handleRestaurar(params.row)}
          >
            {t('restoreButton')}
          </Button>
          <Tooltip title={t('delete')}>
            <IconButton color="error" size="small" onClick={() => handleEliminar(params.row.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box p={{ xs: 2, md: 3 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" mb={3} spacing={2}>
        <MainTitle title={t('title')} />
        
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
          onClick={handleCrear}
          disabled={loading || fetching}
          fullWidth={isMobile}
        >
          {loading ? t('creating') : t('createButton')}
        </Button>
      </Stack>

      {fetching ? (
        <Box display="flex" justifyContent="center" py={10}><CircularProgress /></Box>
      ) : isMobile ? (
        /* Mobile View: Cards */
        <Stack spacing={2}>
          {backups.map((b) => (
            <Paper key={b.id} sx={{ p: 2, borderRadius: 2 }}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="subtitle2" fontWeight="bold" noWrap sx={{ maxWidth: '70%' }}>
                  {b.nombre}
                </Typography>
                <Chip label={b.tamaño} size="small" color="primary" variant="outlined" />
              </Box>
              <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                📅 {formatDateTime(b.fecha)}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack direction="row" spacing={2}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  size="small" 
                  startIcon={<RestoreIcon />}
                  onClick={() => handleRestaurar(b)}
                  disabled={loading}
                >
                  {t('restoreButton')}
                </Button>
                <IconButton 
                  color="error" 
                  sx={{ border: '1px solid', borderColor: 'error.light', borderRadius: 1 }}
                  onClick={() => handleEliminar(b.id)}
                  disabled={loading}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </Paper>
          ))}
          {backups.length === 0 && (
            <Typography textAlign="center" color="text.secondary" py={4}>No hay backups disponibles</Typography>
          )}
        </Stack>
      ) : (
        /* Desktop View: DataGrid */
        <Paper sx={{ height: 500, width: '100%', borderRadius: 2, overflow: 'hidden' }}>
          <DataGrid
            rows={backups}
            columns={columnas}
            getRowId={(r) => r.id}
            disableRowSelectionOnClick
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            sx={{ border: 'none' }}
          />
        </Paper>
      )}
    </Box>
  );
}