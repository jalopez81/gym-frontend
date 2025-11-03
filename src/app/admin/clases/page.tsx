'use client'

import MyContainer from "@/components/MyContainer";
import LoadingAnimation from "@/components/LoadingAnimatino";
import { Clase, Entrenador, Sesion } from "@/types";
import apiClient from "@/utils/apiClient";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
    Box,
    Button,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import CreateClase from "./CreateClase";
import EditClase from "./EditClase";
import EditSesion from "./EditSesion";
import SearchClase from "@/app/clases/SearchClase";
import MainTitle from "@/components/MainTitle";

export interface ClaseForm extends Partial<Omit<Clase, 'id' | 'entrenador' | 'sesiones'>> {
    nombre: string;
    duracion: number;
    capacidad: number;
}

export default function AdminClases() {
    const [clases, setClases] = useState<Clase[]>([]);
    const [entrenadores, setEntrenadores] = useState<Entrenador[]>([]);
    const [entrenadorSeleccionado, setEntrenadorSeleccionado] = useState<string>('');
    const [open, setOpen] = useState(false);
    const [openSesion, setOpenSesion] = useState(false);
    const [claseSeleccionada, setClaseSeleccionada] = useState<string>("");
    const [openEdit, setOpenEdit] = useState(false);
    const [claseEdit, setClaseEdit] = useState<Clase | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [newClase, setNewClase] = useState<ClaseForm>({
        nombre: "Aeróbicos",
        descripcion: "HIIT para principiantes",
        duracion: 40,
        capacidad: 15,
        entrenadorId: "",
        creado: "",
    });
    const [loading, setLoading] = useState(true);


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

    useEffect(() => {
        fetchData();
    }, []);


    const handleAddClase = async (sesiones: string[]) => {
        try {
            setLoading(true);
            const resClases = await apiClient.post('/clases', { ...newClase, entrenadorId: entrenadorSeleccionado });
            const claseId = resClases.data.id;

            const arrNewSesiones = sesiones.map(sesion => ({ fechaHora: sesion, claseId }))
            const resSesiones = await apiClient.post('/sesiones/multiple', [...arrNewSesiones])
            console.log(resSesiones)

            setClases(prev => [...prev, resClases.data]);
            setOpen(false);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleVerSesiones = (id: string) => {
        setClaseSeleccionada(id);
        setOpenSesion(true);
    };

    const handleDelete = async (claseId: string) => {
        if (!confirm('¿Seguro que quieres eliminar esta clase?')) return;

        try {
            await apiClient.delete(`/clases/${claseId}`);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const filteredClases = clases.filter(c =>
        c.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <LoadingAnimation />;


    return (
        <MyContainer className="classes-container" style={{ padding: 20 }}>
            <MainTitle title="Administrar clases" subtitle="Organización de clases, horarios y cupos"/>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between' }}>
                <SearchClase onSearch={setSearchTerm} />
                <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                    Agregar Clase
                </Button>
            </Box>

            {!clases.length && (
                <Typography variant="h6" m={4}>No hay clases registradas</Typography>
            )}


            <Table sx={{ marginTop: 2 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Descripción</TableCell>
                        <TableCell>Duración</TableCell>
                        <TableCell>Capacidad</TableCell>
                        <TableCell>Sesiones</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredClases.map((clase) => (
                        <TableRow key={clase.id}>
                            <TableCell>{clase.nombre}</TableCell>
                            <TableCell>{clase.descripcion}</TableCell>
                            <TableCell>{clase.duracion} min</TableCell>
                            <TableCell>{clase.capacidad} personas</TableCell>
                            <TableCell>
                                <Button size="small" onClick={() => handleVerSesiones(clase.id)}>
                                    Ver sesiones
                                </Button>
                            </TableCell>
                            <TableCell>
                                <IconButton onClick={() => { setClaseEdit(clase); setOpenEdit(true); }}><EditIcon /></IconButton>
                                <IconButton onClick={() => handleDelete(clase.id)}><DeleteIcon /></IconButton>
                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Modal para agregar nueva clase */}
            <CreateClase
                open={open}
                onClose={() => setOpen(false)}
                newClase={newClase}
                setNewClase={setNewClase}
                entrenadorSeleccionado={entrenadorSeleccionado}
                setEntrenadorSeleccionado={setEntrenadorSeleccionado}
                entrenadores={entrenadores}
                onSave={handleAddClase}
            />
            <EditSesion
                open={openSesion}
                onClose={() => setOpenSesion(false)}
                claseId={claseSeleccionada}
            />
            {claseEdit && (
                <EditClase
                    open={openEdit}
                    onClose={() => setOpenEdit(false)}
                    clase={claseEdit}
                    onUpdated={fetchData}
                />
            )}
        </MyContainer>
    );
}
