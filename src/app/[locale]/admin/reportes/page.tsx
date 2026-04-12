'use client';

import { useEffect, useState, useCallback, useMemo } from "react";
import { Tabs, Tab, Box, Button, Paper, Typography, Stack, useTheme, useMediaQuery } from "@mui/material";
import { alpha } from "@mui/material/styles";
import MyContainer from "@/components/MyContainer";
import apiClient from "@/utils/apiClient";
import MainTitle from "@/components/MainTitle";
import { DataGrid } from "@mui/x-data-grid";
import { getColsDef } from './columns'
import LoadingAnimation from "@/components/LoadingAnimatino";
import { useTranslations } from 'next-intl';
import DownloadIcon from '@mui/icons-material/Download';
import ReportSpotlightCards from "./ReportSpotlightCards";

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

function rankingSpotlightClass(tab: ReportTab, row: { ranking?: number }): string {
  if (tab !== "productos-mas-vendidos" && tab !== "ventas-por-categoria") return "";
  const r = row.ranking;
  if (r === 1) return "report-row-gold";
  if (r === 2) return "report-row-silver";
  if (r === 3) return "report-row-bronze";
  return "";
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

  const showRankingSpotlight =
    tab === "productos-mas-vendidos" || tab === "ventas-por-categoria";

  const spotlightRows = useMemo(() => {
    if (!showRankingSpotlight || report.data.length === 0) return [];
    const sorted = [...report.data].sort(
      (a: { ranking?: number }, b: { ranking?: number }) =>
        (a.ranking ?? 999) - (b.ranking ?? 999)
    );
    return sorted.slice(0, 3) as Record<string, unknown>[];
  }, [report.data, showRankingSpotlight]);

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

        <Box
          sx={{
            width: '100%',
            p: { xs: 1, sm: 2 },
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            minHeight: showRankingSpotlight ? 640 : 600,
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', flex: 1, minHeight: 480, alignItems: 'center', justifyContent: 'center' }}>
                <LoadingAnimation />
            </Box>
          ) : report.data.length > 0 ? (
            <>
              {showRankingSpotlight ? (
                <ReportSpotlightCards variant={tab} rows={spotlightRows} />
              ) : null}
              <Box sx={{ width: '100%', height: showRankingSpotlight ? 480 : 600, minHeight: 320 }}>
                <DataGrid
                  rows={report.data}
                  columns={columns[tab]}
                  getRowId={(row) => getRowIdForTab(tab, row as Record<string, unknown>)}
                  getRowClassName={(params) =>
                    rankingSpotlightClass(tab, params.row as { ranking?: number })
                  }
                  pageSizeOptions={[10, 25]}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                  }}
                  density={isMobile ? "compact" : "standard"}
                  disableRowSelectionOnClick
                  sx={{
                    border: 'none',
                    height: '100%',
                    '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold' },
                    '& .report-row-gold': {
                      bgcolor: (th) => alpha('#FFB300', th.palette.mode === 'dark' ? 0.2 : 0.14),
                      boxShadow: (th) => `inset 3px 0 0 0 ${alpha('#FFB300', 0.95)}`,
                    },
                    '& .report-row-silver': {
                      bgcolor: (th) => alpha('#90A4AE', th.palette.mode === 'dark' ? 0.18 : 0.12),
                      boxShadow: (th) => `inset 3px 0 0 0 ${alpha('#90A4AE', 0.85)}`,
                    },
                    '& .report-row-bronze': {
                      bgcolor: (th) => alpha('#A1887F', th.palette.mode === 'dark' ? 0.22 : 0.12),
                      boxShadow: (th) => `inset 3px 0 0 0 ${alpha('#8D6E63', 0.9)}`,
                    },
                  }}
                />
              </Box>
            </>
          ) : (
            <Box sx={{ display: 'flex', flex: 1, minHeight: 400, alignItems: 'center', justifyContent: 'center', py: 10 }}>
                <Typography color="text.secondary">{t('noData')}</Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </MyContainer>
  );
}