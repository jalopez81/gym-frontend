'use client';

import MainTitle from '@/components/MainTitle';
import MyContainer from '@/components/MyContainer';
import apiClient from '@/utils/apiClient';
import { Grid, Typography } from '@mui/material';
import { Suspense, useEffect, useMemo, useState } from 'react';
import EntrenadorCard from './EntrenadorCard';
import { Entrenador } from '@/types';
import { useTranslations } from 'next-intl';
import LoadingAnimation from '@/components/LoadingAnimatino';
import { useSearchParams } from 'next/navigation';

function EntrenadoresPageContent() {
  const [entrenadores, setEntrenadores] = useState<Entrenador[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations('Trainers');
  const searchParams = useSearchParams();

  const nombreFiltro = useMemo(
    () => (searchParams.get('nombre') ?? '').trim().toLowerCase(),
    [searchParams]
  );

  const mostrar = useMemo(() => {
    if (!nombreFiltro) return entrenadores;
    return entrenadores.filter((e) =>
      (e.usuario?.nombre ?? '').toLowerCase().includes(nombreFiltro)
    );
  }, [entrenadores, nombreFiltro]);

  useEffect(() => {
    const fetchEntrenadores = async () => {
      try {
        const res = await apiClient.get('/entrenadores');
        setEntrenadores(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEntrenadores();
  }, []);

  if (loading) {
    return <LoadingAnimation caption={t('loading')} />;
  }

  return (
    <MyContainer sx={{ background: '#eeeeee', py: 4 }}>
      <MainTitle title={t('title')} subtitle={t('subtitle')} />
      {nombreFiltro && mostrar.length === 0 ? (
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          {t('noMatch')}
        </Typography>
      ) : null}
      <Grid container spacing={3}>
        {mostrar.map((ent) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={ent.id}>
            <EntrenadorCard ent={ent} />
          </Grid>
        ))}
      </Grid>
    </MyContainer>
  );
}

export default function EntrenadoresPage() {
  const t = useTranslations('Trainers');
  return (
    <Suspense fallback={<LoadingAnimation caption={t('loading')} />}>
      <EntrenadoresPageContent />
    </Suspense>
  );
}
