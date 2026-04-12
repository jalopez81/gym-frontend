'use client';

import { useEffect, useState, useCallback, useMemo } from "react";
import { Tabs, Tab, Box, Button, Paper, Typography, Stack, useTheme, useMediaQuery } from "@mui/material";
import MyContainer from "@/components/MyContainer";
import apiClient from "@/utils/apiClient";
import MainTitle from "@/components/MainTitle";
import { DataGrid } from "@mui/x-data-grid";
import { getColsDef } from './columns'
import LoadingAnimation from "@/components/LoadingAnimatino";
import { useTranslations } from 'next-intl';
import DownloadIcon from '@mui/icons-material/Download';

type ReportTab =
  | "ordenes"
  | "productos"
  | "suscripciones"
  | "asistencias"
  | "productos-mas-vendidos"
  | "ventas-por-categoria";

function getRowIdForTab(tab: ReportTab, row: Record<string, unknown>): string {
  if (tab === "productos-mas-vendidos") return String(row.productoId ?? row.ranking);
  if (tab === "ventas-por-categoria") return String(row.categoria ?? row.ranking);
  return String(row.id);
}

export default function Reportes() {
  const [report, setReport] = useState({ title: "", data: [] });
  const [tab, setTab] = useState<ReportTab>("ordenes");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const t = useTranslations('AdminReports');
  
  const columns = useMemo(() => getColsDef(t), [t]);

  const fetchReportes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/reportes/${tab}`);
      setReport({ title: `Reporte de ${tab}`, data: res.data });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  const fetchReportesDownload = async () => {
    setDownloading(true);
    try {
      const res = await apiClient.get(`/reportes/${tab}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `Reporte_${tab}.xlsx`;
      a.click();
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => { fetchReportes(); }, [fetchReportes]);

  return (
    <MyContainer>
      {/* Header Stack: Stacks on mobile, side-by-side on desktop */}
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={2} 
        justifyContent="space-between" 
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        mb={3}
      >
        <MainTitle title={t('title')} />
        
        <Button 
          variant="contained" 
          startIcon={<DownloadIcon />}
          onClick={fetchReportesDownload}
          disabled={downloading || report.data.length === 0}
          fullWidth={isMobile} // Big button for easy tapping on mobile
        >
          {downloading ? t('processing') : t('download')}
        </Button>
      </Stack>

      <Paper sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
        {/* Scrollable Tabs for small screens */}
        <Tabs 
          value={tab} 
          onChange={(_, v) => setTab(v as ReportTab)} 
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label={t('orders')} value="ordenes" />
          <Tab label={t('products')} value="productos" />
          <Tab label={t('subscriptions')} value="suscripciones" />
          <Tab label={t('attendance')} value="asistencias" />
          <Tab label={t('topProducts')} value="productos-mas-vendidos" />
          <Tab label={t('salesByCategory')} value="ventas-por-categoria" />
        </Tabs>

        <Box sx={{ height: 600, width: '100%', p: { xs: 1, sm: 2 } }}>
          {loading ? (
            <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <LoadingAnimation />
            </Box>
          ) : report.data.length > 0 ? (
            <DataGrid
              rows={report.data}
              columns={columns[tab]}
              getRowId={(row) => getRowIdForTab(tab, row as Record<string, unknown>)}
              pageSizeOptions={[10, 25]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              // Density "compact" helps fit more data on small screens
              density={isMobile ? "compact" : "standard"}
              disableRowSelectionOnClick
              sx={{ 
                border: 'none',
                '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold' }
              }}
            />
          ) : (
            <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', py: 10 }}>
                <Typography color="text.secondary">{t('noData')}</Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </MyContainer>
  );
}