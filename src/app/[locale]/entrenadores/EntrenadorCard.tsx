'use client'


import { Box, Button, Card, Tooltip, Typography } from '@mui/material';
import { CldImage } from 'next-cloudinary';
import { Entrenador, Clase } from '@/types';
import { useRouter } from "@/i18n/routing";


type EntrenadorCardProps = {
    ent: Entrenador
}

export default function EntrenadorCard({ ent }: EntrenadorCardProps) {
    const router = useRouter();
    const clasesList = (clases: Clase[]) => {

        return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>{clases?.map((clase: Clase) => (
                <Box key={clase.nombre}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        background: '#ffffff',
                        color: '#000000',
                        padding: 1
                    }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{clase.nombre}</Typography>
                    <Typography variant="subtitle2">{clase.duracion} minutos</Typography>
                    <Typography variant="overline">Capacidad: {clase.capacidad} </Typography>
                    <Button size="small" onClick={()=> router.push('/clases?search-class=' + clase.nombre)}>Inscribirse</Button>
                </Box>
            ))}
            </Box>)
    }

    return (
        <Box key={ent.id} sx={{ display: 'flex' }}>
            <Card sx={{
                p: 2,
                width: 360,
                m: 1
            }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                    <CldImage src={ent.usuario.imagenSecureUrl || ''} width={110} height={110} crop="fill" gravity="faces" quality="auto" alt="Entrenador" loading="lazy" radius={200} />
                    <Typography variant="h6">{ent.usuario.nombre}</Typography>
                    <Typography variant="body2">{ent.usuario.email}</Typography>
                    <Box className="divider" sx={{ borderBottom: 'solid 1px #cecece', width: '100%', marginY: 1 }}></Box>
                    <Typography variant="body2">{ent.especialidad}</Typography>
                    <Typography variant="body2">{ent.experiencia} años de experiencia</Typography>
                    <Typography variant="body2">{ent.certificaciones}</Typography>

                    <Tooltip title={ent.clases?.length ? clasesList(ent.clases) : null} sx={{ background: "#ffffff" }}>
                        <Button variant='text' sx={{ m: 1, color: ent.clases?.length ? '#a43f4a' : '#c3c3c3' }}>{ent.clases?.length ? 'Ver clases' : 'No tiene clases'}</Button>
                    </Tooltip>
                </Box>
            </Card>
        </Box>
    )
}