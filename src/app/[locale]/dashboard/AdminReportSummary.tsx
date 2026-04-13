'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Link as MuiLink,
  Stack,
  CircularProgress,
} from '@mui/material';
import apiClient from '@/utils/apiClient';
import { reportesJsonPath } from '@/utils/reportesApi';
import { formatMoney } from '@/utils';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { ReportTabIcon, type ReportTabId } from '@/utils/reportTabIcons';

type OrdenRow = { estado?: string; total?: number };
type RankingRow = { ranking?: number; nombre?: string; categoria?: string; ingresosTotales?: number };

const VENTA_ESTADOS = new Set(['PAGADA', 'COMPLETADA', 'ENVIADA']);

function countVentasOrdenes(ordenes: OrdenRow[]) {
  let n = 0;
  let sum = 0;
  for (const o of ordenes) {
    const e = String(o.estado ?? '').toUpperCase();
    if (VENTA_ESTADOS.has(e)) {
      n += 1;
      sum += Number(o.total) || 0;
    }
  }
  return { n, sum };
}

function topByRanking<T extends { ranking?: number }>(rows: T[], take: number): T[] {
  return [...rows]
    .sort((a, b) => (a.ranking ?? 999) - (b.ranking ?? 999))
    .slice(0, take);
}

function reportHref(tab: ReportTabId) {
  return `/admin/reportes?tab=${encodeURIComponent(tab)}`;
}

export default function AdminReportSummary() {
  const t = useTranslations('Dashboard.adminReports');
  const [loading, setLoading] = useState(true);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [payload, setPayload] = useState<{
    ordenes: OrdenRow[];
    productosTop: RankingRow[];
    categoriasTop: RankingRow[];
    clasesTop: RankingRow[];
    entrenadoresTop: RankingRow[];
    suscripciones: unknown[];
    asistencias: unknown[];
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setFetchFailed(false);
      try {
        const [
          ordenesRes,
          prodRes,
          catRes,
          clasesRes,
          entRes,
          subsRes,
          asistRes,
        ] = await Promise.all([
          apiClient.get(reportesJsonPath('ordenes')),
          apiClient.get(reportesJsonPath('productos-mas-vendidos')),
          apiClient.get(reportesJsonPath('ventas-por-categoria')),
          apiClient.get(reportesJsonPath('clases-mas-populares')),
          apiClient.get(reportesJsonPath('entrenadores-mas-populares')),
          apiClient.get(reportesJsonPath('suscripciones')),
          apiClient.get(reportesJsonPath('asistencias')),
        ]);
        if (cancelled) return;
        setPayload({
          ordenes: Array.isArray(ordenesRes.data) ? ordenesRes.data : [],
          productosTop: topByRanking(
            Array.isArray(prodRes.data) ? (prodRes.data as RankingRow[]) : [],
            3
          ),
          categoriasTop: topByRanking(
            Array.isArray(catRes.data) ? (catRes.data as RankingRow[]) : [],
            3
          ),
          clasesTop: topByRanking(
            Array.isArray(clasesRes.data) ? (clasesRes.data as RankingRow[]) : [],
            3
          ),
          entrenadoresTop: topByRanking(
            Array.isArray(entRes.data) ? (entRes.data as RankingRow[]) : [],
            3
          ),
          suscripciones: Array.isArray(subsRes.data) ? subsRes.data : [],
          asistencias: Array.isArray(asistRes.data) ? asistRes.data : [],
        });
      } catch {
        if (!cancelled) setFetchFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const ventas = useMemo(() => {
    if (!payload?.ordenes) return { n: 0, sum: 0, total: 0 };
    const v = countVentasOrdenes(payload.ordenes);
    return { ...v, total: payload.ordenes.length };
  }, [payload]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress size={36} />
      </Box>
    );
  }

  if (fetchFailed) {
    return (
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {t('error')}
      </Typography>
    );
  }

  if (!payload) {
    return null;
  }

  const miniLink = (tab: ReportTabId) => (
    <MuiLink component={Link} href={reportHref(tab)} variant="body2" fontWeight={600} sx={{ mt: 1, display: 'inline-block' }}>
      {t('viewReport')}
    </MuiLink>
  );

  const sectionHeader = (tab: ReportTabId, label: string) => (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
      <ReportTabIcon tab={tab} color="primary" />
      <Typography variant="overline" color="text.secondary" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
        {label}
      </Typography>
    </Stack>
  );

  const topNames = (rows: RankingRow[], label: (r: RankingRow) => string) =>
    rows.length ? (
      <Stack component="ul" sx={{ m: 0, pl: 2, mb: 0 }} spacing={0.25}>
        {rows.map((r, i) => (
          <Typography key={i} component="li" variant="body2" color="text.secondary">
            {label(r)}
          </Typography>
        ))}
      </Stack>
    ) : (
      <Typography variant="body2" color="text.secondary">
        {t('noData')}
      </Typography>
    );

  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 1, color: '#333' }}>
        {t('title')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('subtitle')}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #eee', height: '100%' }}>
            {sectionHeader('ordenes', t('orders'))}
            <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>
              {ventas.total}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t('ordersSales', { count: ventas.n, amount: formatMoney(ventas.sum) })}
            </Typography>
            {miniLink('ordenes')}
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #eee', height: '100%' }}>
            {sectionHeader('productos-mas-vendidos', t('topProducts'))}
            {topNames(payload.productosTop, (r) => String(r.nombre ?? '—'))}
            {miniLink('productos-mas-vendidos')}
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #eee', height: '100%' }}>
            {sectionHeader('ventas-por-categoria', t('topCategories'))}
            {topNames(payload.categoriasTop, (r) =>
              `${String(r.categoria ?? '—')} · ${formatMoney(r.ingresosTotales)}`
            )}
            {miniLink('ventas-por-categoria')}
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #eee', height: '100%' }}>
            {sectionHeader('clases-mas-populares', t('topClasses'))}
            {topNames(payload.clasesTop, (r) => String(r.nombre ?? '—'))}
            {miniLink('clases-mas-populares')}
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #eee', height: '100%' }}>
            {sectionHeader('entrenadores-mas-populares', t('topTrainers'))}
            {topNames(payload.entrenadoresTop, (r) => String(r.nombre ?? '—'))}
            {miniLink('entrenadores-mas-populares')}
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #eee', height: '100%' }}>
            {sectionHeader('suscripciones', t('subscriptions'))}
            <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>
              {payload.suscripciones.length}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t('subscriptionsHint')}
            </Typography>
            {miniLink('suscripciones')}
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #eee', height: '100%' }}>
            {sectionHeader('asistencias', t('attendance'))}
            <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>
              {payload.asistencias.length}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t('attendanceHint')}
            </Typography>
            {miniLink('asistencias')}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
