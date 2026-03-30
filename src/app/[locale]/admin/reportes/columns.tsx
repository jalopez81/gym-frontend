import { Box, Chip } from "@mui/material";
import { formatDateTime } from "@/utils";
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
      renderCell: (params) => `$${params.value}`,
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
      renderCell: (params) => `$${params.value}`,
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
      field: "sesion",
      headerName: t('session'),
      width: 200,
      renderCell: (params) => formatDateTime(params.value as string) || ""
    },
    { field: "cliente", headerName: t('client'), width: 200 },
    {
      field: "horaEntrada",
      headerName: t('entry'),
      width: 150,
      renderCell: (params) => formatDateTime(params.value as string) || ""
    },
  ] as GridColDef[],
});