'use client';

import MainTitle from '@/components/MainTitle';
import MyContainer from '@/components/MyContainer';
import apiClient from '@/utils/apiClient';
import {  Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import EntrenadorCard from './EntrenadorCard';
import { Entrenador } from '@/types';
import { useTranslations } from 'next-intl';
import LoadingAnimation from '@/components/LoadingAnimatino';

export default function EntrenadoresPage() {
  const [entrenadores, setEntrenadores] = useState<Entrenador[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations('Trainers');

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

  if (loading) { return <LoadingAnimation caption={t('loading')} /> }

  return (
    <MyContainer sx={{ background: "#eeeeee", py: 4 }}>
      <MainTitle title={t('title')} subtitle={t('subtitle')} />      
      <Grid container spacing={3}>
        {entrenadores.map((ent) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={ent.id}>
            <EntrenadorCard ent={ent} />
          </Grid>
        ))}
      </Grid>
    </MyContainer>
  );
}