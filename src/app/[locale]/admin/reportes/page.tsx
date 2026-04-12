'use client';

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Tabs,
  Tab,
  Box,
  Button,
  Paper,
  Typography,
  Stack,
  useTheme,
  useMediaQuery,
  Alert,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import MyContainer from "@/components/MyContainer";
import apiClient from "@/utils/apiClient";
import MainTitle from "@/components/MainTitle";
import { DataGrid } from "@mui/x-data-grid";
import { getColsDef } from './columns'
import LoadingAnimation from "@/components/LoadingAnimatino";
import { useTranslations } from 'next-intl';
import DownloadIcon from '@mui/icons-material/Download';
import ReportSpotlightCards, { type SpotlightVariant } from "./ReportSpotlightCards";
import {
  reportesJsonPath,
  reportesDownloadPath,
  parseReportDownloadOrThrow,
  getReportesAxiosErrorMessage,
} from "@/utils/reportesApi";
import { isAxiosError } from "axios";

type ReportTab =
  | "ordenes"
  | "productos"
  | "suscripciones"
  | "asistencias"
  | "productos-mas-vendidos"
  | "ventas-por-categoria"
  | "clases-mas-populares"
  | "entrenadores-mas-populares";

function getRowIdForTab(tab: ReportTab, row: Record<string, unknown>): string {
  if (tab === "productos-mas-vendidos") return String(row.productoId ?? row.ranking);
  if (tab === "ventas-por-categoria") return String(row.categoria ?? row.ranking);
  if (tab === "clases-mas-populares") return String(row.claseId ?? row.ranking);
  if (tab === "entrenadores-mas-populares") return String(row.entrenadorId ?? row.ranking);
  return String(row.id);
}

function rankingSpotlightClass(tab: ReportTab, row: { ranking?: number }): string {
  const rankingTabs: ReportTab[] = [
    "productos-mas-vendidos",
    "ventas-por-categoria",
    "clases-mas-populares",
    "entrenadores-mas-populares",
  ];
  if (!rankingTabs.includes(tab)) return "";
  const r = row.ranking;
  if (r === 1) return "report-row-gold";
  if (r === 2) return "report-row-silver";
  if (r === 3) return "report-row-bronze";
  return "";
}

function tabToSpotlightVariant(tab: ReportTab): SpotlightVariant | null {
  if (
    tab === "productos-mas-vendidos" ||
    tab === "ventas-por-categoria" ||
    tab === "clases-mas-populares" ||
    tab === "entrenadores-mas-populares"
  ) {
    return tab;
  }
  return null;
}

export default function Reportes() {
  const [report, setReport] = useState<{ title: string; data: unknown[] }>({ title: "", data: [] });
  const [tab, setTab] = useState<ReportTab>("ordenes");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const t = useTranslations('AdminReports');
  
  const columns = useMemo(() => getColsDef(t), [t]);

  const spotlightVariant = tabToSpotlightVariant(tab);
  const showRankingSpotlight = spotlightVariant !== null;

  const spotlightRows = useMemo(() => {
    if (!showRankingSpotlight || report.data.length === 0) return [];
    const sorted = [...report.data].sort((a: unknown, b: unknown) => {
      const ra = (a as { ranking?: number }).ranking ?? 999;
      const rb = (b as { ranking?: number }).ranking ?? 999;
      return ra - rb;
    });
    return sorted.slice(0, 3) as Record<string, unknown>[];
  }, [report.data, showRankingSpotlight]);

  useEffect(() => {
    setFetchError(null);
    setDownloadError(null);
  }, [tab]);

  const fetchReportes = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await apiClient.get(reportesJsonPath(tab), {
        headers: { Accept: "application/json" },
      });
      setReport({ title: `Reporte de ${tab}`, data: Array.isArray(res.data) ? res.data : [] });
    } catch (err) {
      console.error(err);
      setReport({ title: "", data: [] });
      setFetchError(
        getReportesAxiosErrorMessage(err, {
          auth: t("errorAuth"),
          generic: t("errorGeneric"),
        })
      );
    } finally {
      setLoading(false);
    }
  }, [tab, t]);

  const fetchReportesDownload = async () => {
    setDownloading(true);
    setDownloadError(null);
    try {
      const res = await apiClient.get(reportesDownloadPath(tab), {
        responseType: "blob",
        headers: { Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
      });
      const { blob, filename } = await parseReportDownloadOrThrow(res, tab);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      if (err instanceof Error && !isAxiosError(err)) {
        setDownloadError(err.message);
      } else {
        setDownloadError(
          getReportesAxiosErrorMessage(err, {
            auth: t("errorAuth"),
            generic: t("errorDownload"),
          })
        );
      }
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => { fetchReportes(); }, [fetchReportes]);

  const banner = fetchError || downloadError;

  return (
    <MyContainer>
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
          fullWidth={isMobile}
        >
          {downloading ? t('processing') : t('download')}
        </Button>
      </Stack>

      <Paper sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
        {banner ? (
          <Alert
            severity="error"
            onClose={() => {
              setFetchError(null);
              setDownloadError(null);
            }}
            sx={{ m: 2, mb: 0 }}
          >
            {banner}
          </Alert>
        ) : null}

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
          <Tab label={t('popularClasses')} value="clases-mas-populares" />
          <Tab label={t('popularTrainers')} value="entrenadores-mas-populares" />
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
              {spotlightVariant ? (
                <ReportSpotlightCards variant={spotlightVariant} rows={spotlightRows} />
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
                      boxShadow: `inset 3px 0 0 0 ${alpha('#FFB300', 0.95)}`,
                    },
                    '& .report-row-silver': {
                      bgcolor: (th) => alpha('#90A4AE', th.palette.mode === 'dark' ? 0.18 : 0.12),
                      boxShadow: `inset 3px 0 0 0 ${alpha('#90A4AE', 0.85)}`,
                    },
                    '& .report-row-bronze': {
                      bgcolor: (th) => alpha('#A1887F', th.palette.mode === 'dark' ? 0.22 : 0.12),
                      boxShadow: `inset 3px 0 0 0 ${alpha('#8D6E63', 0.9)}`,
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
