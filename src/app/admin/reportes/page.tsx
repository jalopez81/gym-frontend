"use client";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Tabs, Tab, Box, Typography, Button } from "@mui/material";
import MyContainer from "@/components/MyContainer";
import apiClient from "@/utils/apiClient";
import MainTitle from "@/components/MainTitle";

const reportData = {
  ventas: {
    title: "Reporte de Ventas",
    columns: [
      { field: "id", headerName: "ID", width: 80 },
      { field: "fecha", headerName: "Fecha", width: 150 },
      { field: "cliente", headerName: "Cliente", width: 200 },
      { field: "total", headerName: "Total", width: 120 },
      { field: "estado", headerName: "Estado", width: 150 },
    ],
    rows: [
      { id: 1, fecha: "2025-11-01", cliente: "Juan Pérez", total: 1500, estado: "Pagado" },
      { id: 2, fecha: "2025-11-02", cliente: "Ana Gómez", total: 2000, estado: "Pendiente" },
    ],
  },
  suscripciones: {
    title: "Reporte de Suscripciones",
    columns: [
      { field: "id", headerName: "ID", width: 80 },
      { field: "usuario", headerName: "Usuario", width: 200 },
      { field: "plan", headerName: "Plan", width: 150 },
      { field: "estado", headerName: "Estado", width: 120 },
      { field: "fechaVencimiento", headerName: "Vencimiento", width: 180 },
    ],
    rows: [
      { id: 1, usuario: "Luis Díaz", plan: "Mensual", estado: "Activa", fechaVencimiento: "2025-12-01" },
      { id: 2, usuario: "María López", plan: "Anual", estado: "Cancelada", fechaVencimiento: "2026-11-01" },
    ],
  },
  asistencias: {
    title: "Reporte de Asistencias",
    columns: [
      { field: "id", headerName: "ID", width: 80 },
      { field: "cliente", headerName: "Cliente", width: 200 },
      { field: "clase", headerName: "Clase", width: 180 },
      { field: "fecha", headerName: "Fecha", width: 150 },
      { field: "estado", headerName: "Estado", width: 120 },
    ],
    rows: [
      { id: 1, cliente: "Carlos Ruiz", clase: "Spinning", fecha: "2025-11-05", estado: "Asistió" },
      { id: 2, cliente: "Lucía Pérez", clase: "Yoga", fecha: "2025-11-05", estado: "Ausente" },
    ],
  },
  entrenadores: {
    title: "Reporte de Entrenadores",
    columns: [
      { field: "id", headerName: "ID", width: 80 },
      { field: "nombre", headerName: "Nombre", width: 200 },
      { field: "especialidad", headerName: "Especialidad", width: 180 },
      { field: "clientes", headerName: "Clientes Asignados", width: 180 },
      { field: "experiencia", headerName: "Años de Experiencia", width: 200 },
    ],
    rows: [
      { id: 1, nombre: "Pedro Sánchez", especialidad: "Crossfit", clientes: 10, experiencia: 5 },
      { id: 2, nombre: "Laura Gómez", especialidad: "Pilates", clientes: 8, experiencia: 3 },
    ],
  },
  productos: {
    title: "Reporte de Productos",
    columns: [
      { field: "id", headerName: "ID", width: 80 },
      { field: "nombre", headerName: "Producto", width: 200 },
      { field: "categoria", headerName: "Categoría", width: 150 },
      { field: "precio", headerName: "Precio", width: 120 },
      { field: "stock", headerName: "Stock", width: 120 },
    ],
    rows: [
      { id: 1, nombre: "Proteína Whey", categoria: "Suplementos", precio: 1200, stock: 15 },
      { id: 2, nombre: "Guantes Gym", categoria: "Accesorios", precio: 500, stock: 40 },
    ],
  },
};

type ReportKey = keyof typeof reportData;

export default function Reportes() {
  const [tab, setTab] = useState<ReportKey>("ventas");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReportes = async () => {
        try {
            const res = await apiClient.get('/reportes');
            setData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReportes();
    }, []);

  return (
    <MyContainer className="reportes-container">
      <Box sx={{ display: 'flex', justifyContent: "space-between"}}>
        <MainTitle title="Reportes"/>
        <Button onClick={fetchReportes}>Refrescar</Button>
        
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        {Object.keys(reportData).map((key) => (
          <Tab key={key} label={reportData[key as ReportKey].title} value={key} />
        ))}
      </Tabs>

      <Box sx={{ height: 400 }}>
        <DataGrid
          rows={reportData[tab].rows as any[]}
          columns={reportData[tab].columns as any[]}
          pageSizeOptions={[5, 10]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5, page: 0 } },
          }}
        />

      </Box>
    </MyContainer>
  );
}
