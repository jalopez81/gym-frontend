'use client';

import { Box, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useTranslations } from 'next-intl';
import { formatMoney } from '@/utils';

export type SpotlightVariant =
  | 'productos-mas-vendidos'
  | 'ventas-por-categoria'
  | 'clases-mas-populares'
  | 'entrenadores-mas-populares';

const RANK_STYLES = [
  { bar: '#FFB300', label: '1' },
  { bar: '#90A4AE', label: '2' },
  { bar: '#A1887F', label: '3' },
] as const;

function SpotlightStats({ variant, row }: { variant: SpotlightVariant; row: Record<string, unknown> }) {
  const t = useTranslations('AdminReports');
  if (variant === 'productos-mas-vendidos' || variant === 'ventas-por-categoria') {
    return (
      <Stack direction="row" spacing={2} sx={{ mt: 1.25 }} flexWrap="wrap" useFlexGap>
        <Typography variant="body2" color="text.secondary">
          {t('unitsSold')}:{' '}
          <Box component="span" fontWeight={600} color="text.primary">
            {Number(row.unidadesVendidas) || 0}
          </Box>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('totalRevenue')}:{' '}
          <Box component="span" fontWeight={600} color="text.primary">
            {formatMoney(row.ingresosTotales)}
          </Box>
        </Typography>
      </Stack>
    );
  }

  if (variant === 'clases-mas-populares') {
    return (
      <Stack direction="row" spacing={2} sx={{ mt: 1.25 }} flexWrap="wrap" useFlexGap>
        <Typography variant="body2" color="text.secondary">
          {t('totalAttendances')}:{' '}
          <Box component="span" fontWeight={600} color="text.primary">
            {Number(row.totalAsistencias) || 0}
          </Box>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('totalReservations')}:{' '}
          <Box component="span" fontWeight={600} color="text.primary">
            {Number(row.totalReservas) || 0}
          </Box>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('classCapacity')}:{' '}
          <Box component="span" fontWeight={600} color="text.primary">
            {Number(row.capacidad) || 0}
          </Box>
        </Typography>
      </Stack>
    );
  }

  /* entrenadores-mas-populares */
  return (
    <Stack direction="row" spacing={2} sx={{ mt: 1.25 }} flexWrap="wrap" useFlexGap>
      <Typography variant="body2" color="text.secondary">
        {t('totalAttendances')}:{' '}
        <Box component="span" fontWeight={600} color="text.primary">
          {Number(row.totalAsistencias) || 0}
        </Box>
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {t('totalReservations')}:{' '}
        <Box component="span" fontWeight={600} color="text.primary">
          {Number(row.totalReservas) || 0}
        </Box>
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {t('activeClients')}:{' '}
        <Box component="span" fontWeight={600} color="text.primary">
          {Number(row.clientesActivos) || 0}
        </Box>
      </Typography>
    </Stack>
  );
}

export default function ReportSpotlightCards({
  variant,
  rows,
}: {
  variant: SpotlightVariant;
  rows: Record<string, unknown>[];
}) {
  const t = useTranslations('AdminReports');
  const theme = useTheme();

  if (rows.length === 0) return null;

  const title =
    variant === 'productos-mas-vendidos'
      ? t('podiumProductsTitle')
      : variant === 'ventas-por-categoria'
        ? t('podiumCategoriesTitle')
        : variant === 'clases-mas-populares'
          ? t('podiumClassesTitle')
          : t('podiumTrainersTitle');

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 600 }}>
        {title}
      </Typography>
      <Grid container spacing={2}>
        {rows.map((row, index) => {
          const rank = typeof row.ranking === 'number' ? row.ranking : index + 1;
          const style = RANK_STYLES[Math.min(rank - 1, 2)] ?? RANK_STYLES[2];
          const name =
            variant === 'ventas-por-categoria'
              ? String(row.categoria ?? '—')
              : String(row.nombre ?? '—');
          const subtitle =
            variant === 'productos-mas-vendidos' && row.categoria
              ? String(row.categoria)
              : variant === 'entrenadores-mas-populares' && row.especialidad
                ? String(row.especialidad)
                : null;

          return (
            <Grid item xs={12} sm={4} key={`${rank}-${name}`}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: 2,
                  border: 1,
                  borderColor: 'divider',
                  bgcolor: (th) => alpha(style.bar, th.palette.mode === 'dark' ? 0.12 : 0.08),
                  boxShadow: `inset 4px 0 0 0 ${style.bar}`,
                  transition: theme.transitions.create(['box-shadow', 'transform'], {
                    duration: theme.transitions.duration.shorter,
                  }),
                  '&:hover': {
                    boxShadow: (th) =>
                      `inset 4px 0 0 0 ${style.bar}, ${th.shadows[2]}`,
                  },
                }}
              >
                <CardContent sx={{ py: 2, px: 2.25, '&:last-child': { pb: 2 } }}>
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <Box
                      aria-hidden
                      sx={{
                        minWidth: 36,
                        height: 36,
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1rem',
                        bgcolor: alpha(style.bar, 0.35),
                        color: 'text.primary',
                      }}
                    >
                      {style.label}
                    </Box>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight={700} noWrap title={name}>
                        {name}
                      </Typography>
                      {subtitle ? (
                        <Typography variant="caption" color="text.secondary" noWrap display="block">
                          {subtitle}
                        </Typography>
                      ) : null}
                      <SpotlightStats variant={variant} row={row} />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
