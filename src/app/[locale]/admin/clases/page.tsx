'use client';

import { useEffect, useState } from "react";
import { useTranslations } from 'next-intl';
import {
    Box,
    Button,
    IconButton,
    Popover,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
    Paper,
    Stack,
    Chip,
    Divider
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import MyContainer from "@/components/MyContainer";
import LoadingAnimation from "@/components/LoadingAnimatino";
import MainTitle from "@/components/MainTitle";
import SearchClase from "@/app/[locale]/clases/SearchClase";
import EntrenadorCard from "@/app/[locale]/entrenadores/EntrenadorCard";

import CreateClase from "./CreateClase";
import EditClase from "./EditClase";
import EditSesion from "./EditSesion";

import apiClient from "@/utils/apiClient";
import { Clase, ClaseForm, Entrenador } from "@/types";
import { useBreakpoints } from "@/utils/useMediaQuery";

export default function AdminClases() {
    const { isMobile } = useBreakpoints();
    const t = useTranslations('AdminClasses');

    const [clases, setClases] = useState<Clase[]>([]);
    const [entrenadores, setEntrenadores] = useState<Entrenador[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modals State
    const [openCreate, setOpenCreate] = useState(false);
    const [openSesion, setOpenSesion] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    
    const [claseSeleccionada, setClaseSeleccionada] = useState<string>("");
    const [claseEdit, setClaseEdit] = useState<Clase | null>(null);
    const [entrenadorSeleccionado, setEntrenadorSeleccionado] = useState<string>('');

    // Popover State
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [popoverEntrenador, setPopoverEntrenador] = useState<Entrenador | null>(null);

    const [newClase, setNewClase] = useState<ClaseForm>({
        nombre: "Aeróbicos",
        descripcion: "HIIT para principiantes",
        duracion: 40,
        capacidad: 15,
        entrenadorId: "",
        creado: "",
    });

    const fetchData = async () => {
        try {
            const [resClases, resEntrenadores] = await Promise.all([
                apiClient.get('/clases'),
                apiClient.get('/entrenadores'),
            ]);
            setClases(resClases.data);
            setEntrenadores(resEntrenadores.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleAddClase = async (sesiones: string[]) => {
        try {
            setLoading(true);
            const resClases = await apiClient.post('/clases', { ...newClase, entrenadorId: entrenadorSeleccionado });
            const claseId = resClases.data.id;
            const arrNewSesiones = sesiones.map(sesion => ({ fechaHora: sesion, claseId }));
            await apiClient.post('/sesiones/multiple', arrNewSesiones);
            await fetchData();
            setOpenCreate(false);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (claseId: string) => {
        if (!confirm(t('confirmDelete'))) return;
        try {
            await apiClient.delete(`/clases/${claseId}`);
            fetchData();
        } catch (err) { console.error(err); }
    };

    const handleOpenPopover = (event: React.MouseEvent<HTMLElement>, ent: Entrenador) => {
        setAnchorEl(event.currentTarget);
        setPopoverEntrenador(ent);
    };

    const filteredClases = clases.filter(c =>
        c.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <LoadingAnimation />;

    return (
        <MyContainer sx={{ py: 4 }}>
            <MainTitle title={t('title')} subtitle={t('subtitle')} />
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <SearchClase onSearch={setSearchTerm} />
                <Button 
                    fullWidth={isMobile} 
                    variant="contained" 
                    onClick={() => setOpenCreate(true)}
                    sx={{ height: 40 }}
                >
                    {t('addButton')}
                </Button>
            </Stack>

            {!filteredClases.length ? (
                <Typography variant="h6" textAlign="center" color="text.secondary" my={5}>{t('noClasses')}</Typography>
            ) : isMobile ? (
                /* MOBILE VIEW: Cards */
                <Stack spacing={2}>
                    {filteredClases.map((clase) => (
                        <Paper key={clase.id}  variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="subtitle1" fontWeight="bold">{clase.nombre}</Typography>
                                <Chip size="small" label={`${clase.duracion} min`} color="primary" variant="outlined" />
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {clase.descripcion}
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography 
                                    variant="body2" 
                                    sx={{ color: 'primary.main', cursor: 'pointer', textDecoration: 'underline' }}
                                    onClick={(e) => handleOpenPopover(e, clase.entrenador)}
                                >
                                    {clase.entrenador.usuario.nombre}
                                </Typography>
                                <Stack direction="row" spacing={1}>
                                    <IconButton size="small" onClick={() => { setClaseSeleccionada(clase.id); setOpenSesion(true); }}>
                                        <CalendarMonthIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" color="primary" onClick={() => { setClaseEdit(clase); setOpenEdit(true); }}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" color="error" onClick={() => handleDelete(clase.id)}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Stack>
                            </Box>
                        </Paper>
                    ))}
                </Stack>
            ) : (
                /* DESKTOP VIEW: Table */
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('name')}</TableCell>
                            <TableCell>{t('duration')}</TableCell>
                            <TableCell>{t('capacity')}</TableCell>
                            <TableCell>{t('instructor')}</TableCell>
                            <TableCell align="center">{t('sessions')}</TableCell>
                            <TableCell align="right">{t('actions')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredClases.map((clase) => (
                            <TableRow key={clase.id} hover>
                                <TableCell>
                                    <Typography fontWeight="bold">{clase.nombre}</Typography>
                                    <Typography variant="caption" color="text.secondary">{clase.descripcion}</Typography>
                                </TableCell>
                                <TableCell>{clase.duracion} min</TableCell>
                                <TableCell>{clase.capacidad} {t('people')}</TableCell>
                                <TableCell>
                                    <Typography 
                                        variant="body2" 
                                        sx={{ cursor: 'pointer', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}
                                        onClick={(e) => handleOpenPopover(e, clase.entrenador)}
                                    >
                                        {clase.entrenador.usuario.nombre}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Button variant="outlined" size="small" onClick={() => { setClaseSeleccionada(clase.id); setOpenSesion(true); }}>
                                        {t('viewSessions')}
                                    </Button>
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton color="primary" onClick={() => { setClaseEdit(clase); setOpenEdit(true); }}><EditIcon /></IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(clase.id)}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {/* Shared Popover for Instructor info */}
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                {popoverEntrenador && <EntrenadorCard ent={popoverEntrenador} />}
            </Popover>

            {/* Modals */}
            <CreateClase
                open={openCreate}
                onClose={() => setOpenCreate(false)}
                newClase={newClase}
                setNewClase={setNewClase}
                entrenadorSeleccionado={entrenadorSeleccionado}
                setEntrenadorSeleccionado={setEntrenadorSeleccionado}
                entrenadores={entrenadores}
                onSave={handleAddClase}
            />
            <EditSesion open={openSesion} onClose={() => setOpenSesion(false)} claseId={claseSeleccionada} />
            {claseEdit && (
                <EditClase
                    open={openEdit}
                    onClose={() => setOpenEdit(false)}
                    clase={claseEdit}
                    onUpdated={fetchData}
                    entrenadores={entrenadores}
                />
            )}
        </MyContainer>
    );
}