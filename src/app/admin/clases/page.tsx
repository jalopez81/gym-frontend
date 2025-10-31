'use client'

import { Clase, Entrenador } from "@/types";
import apiClient from "@/utils/apiClient";
import {
    Button,
    CircularProgress,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import ClaseFormDialog from "./CrearClase";
import SesionFormDialog from "./SesionFormDialog";
import MyContainer from "@/components/Container";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EditClase from "./EditClase";
import LoadingAnimation from "@/components/LoadingAnimatino";

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


    const handleAddClase = async () => {
        try {
            setLoading(true);
            const res = await apiClient.post('/clases', {
                ...newClase,
                entrenadorId: entrenadorSeleccionado,
            });
            setClases(prev => [...prev, res.data]);
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

    if (loading) return <LoadingAnimation />;


    return (
        <MyContainer className="classes-container" style={{ padding: 20 }}>
            <h1>Administrador de Clases</h1>
            <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                Agregar Clase
            </Button>

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
                    {clases.map((clase) => (
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
            <ClaseFormDialog
                open={open}
                onClose={() => setOpen(false)}
                newClase={newClase}
                setNewClase={setNewClase}
                entrenadorSeleccionado={entrenadorSeleccionado}
                setEntrenadorSeleccionado={setEntrenadorSeleccionado}
                entrenadores={entrenadores}
                onSave={handleAddClase}
            />
            <SesionFormDialog
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
