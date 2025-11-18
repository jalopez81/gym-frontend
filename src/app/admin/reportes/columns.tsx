import { Box } from "@mui/material";
import { formatDateTime } from "@/utils";

export const colsDef = {
  ordenes: [
    { field: "id", headerName: "ID", width: 100 },
    {
      field: "fecha",
      headerName: "Fecha",
      width: 200,
      renderCell: (params: any) => formatDateTime(params.value),
    },
    { field: "cliente", headerName: "Cliente", width: 200 },
    {
      field: "total",
      headerName: "Total",
      width: 200,
      renderCell: (params: any) => `$${params.value}`,
    },
    {
      field: "estado",
      headerName: "Estado",
      width: 200,
      renderCell: (params: any) => {
        const v = params.value?.toUpperCase?.() ?? "";
        const colorMap: Record<string, string> = {
          PAGADA: "green",
          COMPLETADA: "green",
          ENVIADA: "blue",
          CANCELADA: "red",
          PENDIENTE: "orange",
        };
        return <Box sx={{ color: colorMap[v] || "gray" }}>{v}</Box>;
      },
    },
  ],

  productos: [
    { field: "id", headerName: "ID", width: 100 },
    { field: "nombre", headerName: "Nombre", width: 200 },
    {
      field: "precio",
      headerName: "Precio",
      width: 200,
      renderCell: (params: any) => `$${params.value}`,
    },
    { field: "stock", headerName: "Stock", width: 200 },
    { field: "categoria", headerName: "Categoría", width: 200 },
  ],

  suscripciones: [
    { field: "id", headerName: "ID", width: 100 },

    {
      field: "cliente",
      headerName: "Cliente",
      width: 200,
    },

    {
      field: "plan",
      headerName: "Plan",
      width: 200,
    },

    {
      field: "precio",
      headerName: "Precio",
      width: 150,
    },

    {
      field: "inicio",
      headerName: "Inicio",
      width: 150,
      renderCell: (params: any) => formatDateTime(params.value),
    },

    {
      field: "fin",
      headerName: "Fin",
      width: 200,
      renderCell: (params: any) => formatDateTime(params.value),
    },
  ],

  asistencias: [
    { field: "id", headerName: "ID", width: 100 },

    {
      field: "sesion",
      headerName: "Sesión",
      width: 220,
      renderCell: (params: any) => formatDateTime(params.value )|| ""
    },

    {
      field: "cliente",
      headerName: "Cliente",
      width: 220,
    },

    {
      field: "horaEntrada",
      headerName: "Entrada",
      width: 150,
      renderCell: (params: any) => formatDateTime(params.value )|| ""
    },
  ],
};
