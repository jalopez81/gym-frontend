'use client';

import { useEffect, useState } from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useApiLoadingStore } from '@/store/apiLoadingStore';

const SLOW_MS = 2000;
/** Aligned with `Navbar` Toolbar `minHeight` so the strip sits under the app bar. */
const APP_BAR_OFFSET_PX = 64;

export default function ApiConnectionBar() {
  const pending = useApiLoadingStore((s) => s.pending);
  const [showSlowHint, setShowSlowHint] = useState(false);
  const t = useTranslations('ApiStatus');

  useEffect(() => {
    if (pending === 0) {
      setShowSlowHint(false);
      return;
    }
    const id = window.setTimeout(() => setShowSlowHint(true), SLOW_MS);
    return () => window.clearTimeout(id);
  }, [pending]);

  if (pending === 0) {
    return null;
  }

  return (
    <Box
      role="status"
      aria-live="polite"
      aria-busy="true"
      sx={{
        position: 'fixed',
        top: APP_BAR_OFFSET_PX,
        left: 0,
        right: 0,
        zIndex: (theme) => theme.zIndex.modal + 2,
        pointerEvents: 'none',
      }}
    >
      <LinearProgress
        color="primary"
        sx={{
          height: 3,
          '& .MuiLinearProgress-bar': {
            transitionDuration: '0.35s',
          },
        }}
      />
      {showSlowHint ? (
        <Typography
          variant="caption"
          component="p"
          sx={{
            m: 0,
            py: 0.75,
            px: 1.5,
            textAlign: 'center',
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(164, 63, 74, 0.08)',
            color: 'text.primary',
            borderBottom: 1,
            borderColor: 'divider',
            fontWeight: 500,
          }}
        >
          {t('slowHint')}
        </Typography>
      ) : (
        <Typography
          variant="caption"
          component="p"
          sx={{
            m: 0,
            py: 0.5,
            px: 1.5,
            textAlign: 'center',
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
            color: 'text.secondary',
          }}
        >
          {t('connecting')}
        </Typography>
      )}
    </Box>
  );
}
