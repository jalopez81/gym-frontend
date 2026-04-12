import { Chip } from "@mui/material";
import { formatDateTime, formatMoney } from "@/utils";
import { GridColDef } from "@mui/x-data-grid";

export const getColsDef = (t: any) => ({
  ordenes: [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "fecha",
      headerName: t('date'),
      width: 180,
      renderCell: (params) => formatDateTime(params.value as string),
    },
    { field: "cliente", headerName: t('client'), width: 180 },
    {
      field: "total",
      headerName: t('total'),
      width: 120,
      renderCell: (params) => formatMoney(params.value),
    },
    {
      field: "estado",
      headerName: t('status'),
      width: 150,
      renderCell: (params) => {
        const v = (params.value as string)?.toUpperCase() || "";
        const colorMap: Record<string, "success" | "info" | "error" | "warning" | "default"> = {
          PAGADA: "success",
          COMPLETADA: "success",
          ENVIADA: "info",
          CANCELADA: "error",
          PENDIENTE: "warning",
        };
        return (
          <Chip 
            label={v} 
            size="small" 
            color={colorMap[v] || "default"} 
            variant="outlined" 
          />
        );
      },
    },
  ] as GridColDef[],

  productos: [
    { field: "id", headerName: "ID", width: 90 },
    { field: "nombre", headerName: t('name'), width: 200 },
    {
      field: "precio",
      headerName: t('price'),
      width: 130,
      renderCell: (params) => formatMoney(params.value),
    },
    { field: "stock", headerName: t('stock'), width: 100 },
    { field: "categoria", headerName: t('category'), width: 150 },
  ] as GridColDef[],

  suscripciones: [
    { field: "id", headerName: "ID", width: 90 },
    { field: "cliente", headerName: t('client'), width: 180 },
    { field: "plan", headerName: t('plan'), width: 150 },
    { field: "precio", headerName: t('price'), width: 120 },
    {
      field: "inicio",
      headerName: t('start'),
      width: 150,
      renderCell: (params) => formatDateTime(params.value as string),
    },
    {
      field: "fin",
      headerName: t('end'),
      width: 150,
      renderCell: (params) => formatDateTime(params.value as string),
    },
  ] as GridColDef[],

  asistencias: [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "horaEntrada",
      headerName: t('entry'),
      width: 160,
      renderCell: (params) => formatDateTime(params.value as string) || "",
    },
    { field: "cliente", headerName: t('client'), width: 200 },
    { field: "clase", headerName: t('class'), width: 180 },
    {
      field: "sesion",
      headerName: t('session'),
      width: 200,
      renderCell: (params) => formatDateTime(params.value as string) || "",
    },
  ] as GridColDef[],

  "productos-mas-vendidos": [
    { field: "ranking", headerName: t('ranking'), width: 90 },
    { field: "productoId", headerName: t('productId'), width: 110 },
    { field: "nombre", headerName: t('name'), width: 220 },
    { field: "categoria", headerName: t('category'), width: 150 },
    {
      field: "precioLista",
      headerName: t('listPrice'),
      width: 120,
      renderCell: (params) =>
        params.value != null && params.value !== "" ? formatMoney(params.value) : "—",
    },
    { field: "unidadesVendidas", headerName: t('unitsSold'), width: 140, type: "number" },
    {
      field: "ingresosTotales",
      headerName: t('totalRevenue'),
      width: 140,
      type: "number",
      renderCell: (params) => formatMoney(params.value),
    },
    { field: "lineasEnOrdenes", headerName: t('orderLines'), width: 140, type: "number" },
  ] as GridColDef[],

  "ventas-por-categoria": [
    { field: "ranking", headerName: t('ranking'), width: 90 },
    { field: "categoria", headerName: t('category'), width: 220 },
    { field: "unidadesVendidas", headerName: t('unitsSold'), width: 150, type: "number" },
    {
      field: "ingresosTotales",
      headerName: t('totalRevenue'),
      width: 150,
      type: "number",
      renderCell: (params) => formatMoney(params.value),
    },
  ] as GridColDef[],

  "clases-mas-populares": [
    { field: "ranking", headerName: t('ranking'), width: 90 },
    { field: "claseId", headerName: t('classId'), width: 110 },
    { field: "nombre", headerName: t('name'), width: 220 },
    { field: "capacidad", headerName: t('classCapacity'), width: 110, type: "number" },
    { field: "totalAsistencias", headerName: t('totalAttendances'), width: 140, type: "number" },
    { field: "totalReservas", headerName: t('totalReservations'), width: 140, type: "number" },
  ] as GridColDef[],

  "entrenadores-mas-populares": [
    { field: "ranking", headerName: t('ranking'), width: 90 },
    { field: "entrenadorId", headerName: t('trainerId'), width: 120 },
    { field: "nombre", headerName: t('name'), width: 200 },
    { field: "especialidad", headerName: t('specialty'), width: 160 },
    { field: "totalAsistencias", headerName: t('totalAttendances'), width: 130, type: "number" },
    { field: "totalReservas", headerName: t('totalReservations'), width: 130, type: "number" },
    { field: "clientesActivos", headerName: t('activeClients'), width: 140, type: "number" },
  ] as GridColDef[],
});