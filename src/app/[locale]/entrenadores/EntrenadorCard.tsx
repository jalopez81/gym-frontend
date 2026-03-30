'use client'

import { Box, Button, Card, Tooltip, Typography } from '@mui/material';
import { CldImage } from 'next-cloudinary';
import { Entrenador, Clase } from '@/types';
import { useRouter } from "@/i18n/routing";
import { useTranslations } from 'next-intl';

type EntrenadorCardProps = {
    ent: Entrenador
}

export default function EntrenadorCard({ ent }: EntrenadorCardProps) {
    const router = useRouter();
    const t = useTranslations('Trainers');

    const clasesList = (clases: Clase[]) => {
        return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, p: 1 }}>
                {clases?.map((clase: Clase) => (
                    <Box key={clase.nombre}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            background: '#ffffff',
                            color: '#000000',
                            padding: 1,
                            borderRadius: 1, 
                            boxShadow: 1   
                        }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{clase.nombre}</Typography>
                        <Typography variant="subtitle2">{clase.duracion} {t('minutes')}</Typography>
                        <Typography variant="overline">{t('capacity')}: {clase.capacidad} </Typography>
                        <Button size="small" onClick={() => router.push('/clases?search-class=' + clase.nombre)}>
                            {t('subscribe')}
                        </Button>
                    </Box>
                ))}
            </Box>
        )
    }

    return (
        <Card sx={{
            p: 2,
            height: '100%', // Makes all cards in a row the same height
            display: 'flex',
            flexDirection: 'column',
            width: '100%',  // IMPORTANT: Remove 360px, use 100% to fill Grid item
            maxWidth: { xs: '100%', sm: 400 }, // Optional: prevent card from getting too huge on tiny screens
            mx: 'auto'      // Center the card if it's smaller than the container
        }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', flexGrow: 1 }}>
                <CldImage 
                    src={ent.usuario.imagenSecureUrl || ''} 
                    width={110} 
                    height={110} 
                    crop="fill" 
                    gravity="faces" 
                    quality="auto" 
                    alt={ent.usuario.nombre} 
                    loading="lazy" 
                    style={{ borderRadius: '50%' }} // Use style for circular images in CldImage
                />
                
                <Typography variant="h6" sx={{ mt: 1, textAlign: 'center' }}>{ent.usuario.nombre}</Typography>
                <Typography variant="body2" color="text.secondary">{ent.usuario.email}</Typography>
                
                <Box className="divider" sx={{ borderBottom: 'solid 1px #cecece', width: '100%', marginY: 2 }}></Box>
                
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{ent.especialidad}</Typography>
                <Typography variant="body2">{ent.experiencia} {t('yearsOfExperience')}</Typography>
                <Typography variant="body2" sx={{ textAlign: 'center', mt: 1 }}>{ent.certificaciones}</Typography>

                {/* Spacer to push the button to the bottom if content is short */}
                <Box sx={{ flexGrow: 1 }} />

                <Tooltip 
                    title={ent.clases?.length ? clasesList(ent.clases) : ""} 
                    enterTouchDelay={0} // Makes it easier to trigger on mobile
                    leaveTouchDelay={3000}
                    componentsProps={{
                        tooltip: {
                            sx: {
                                bgcolor: '#ffffff',
                                border: '1px solid #dadde9',
                                color: 'rgba(0, 0, 0, 0.87)',
                                maxWidth: 500
                            },
                        },
                    }}
                >
                    <Button 
                        variant='text' 
                        sx={{ 
                            mt: 2, 
                            color: ent.clases?.length ? '#a43f4a' : '#c3c3c3',
                            fontWeight: 'bold'
                        }}
                    >
                        {ent.clases?.length ? t('viewClasses') : t('noClasses')}
                    </Button>
                </Tooltip>
            </Box>
        </Card>
    )
}