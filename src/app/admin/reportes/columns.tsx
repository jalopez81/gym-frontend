import { Box } from "@mui/material";
import { formatDateTime } from "@/utils";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

type ColsDefType = {
  ordenes: GridColDef[];
  productos: GridColDef[];
  suscripciones: GridColDef[];
  asistencias: GridColDef[];
};

export const colsDef: ColsDefType = {
  ordenes: [
    { field: "id", headerName: "ID", width: 100 },
    {
      field: "fecha",
      headerName: "Fecha",
      width: 200,
      renderCell: (params: GridRenderCellParams) => formatDateTime(params.value as string),
    },
    { field: "cliente", headerName: "Cliente", width: 200 },
    {
      field: "total",
      headerName: "Total",
      width: 200,
      renderCell: (params: GridRenderCellParams) => `$${params.value}`,
    },
    {
      field: "estado",
      headerName: "Estado",
      width: 200,
      renderCell: (params: GridRenderCellParams) => {
        const v = (params.value as string)?.toUpperCase?.() ?? "";
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
      renderCell: (params: GridRenderCellParams) => `$${params.value}`,
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
      renderCell: (params: GridRenderCellParams) => formatDateTime(params.value as string),
    },

    {
      field: "fin",
      headerName: "Fin",
      width: 200,
      renderCell: (params: GridRenderCellParams) => formatDateTime(params.value as string),
    },
  ],

  asistencias: [
    { field: "id", headerName: "ID", width: 100 },

    {
      field: "sesion",
      headerName: "Sesión",
      width: 220,
      renderCell: (params: GridRenderCellParams) => formatDateTime(params.value as string) || ""
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
      renderCell: (params: GridRenderCellParams) => formatDateTime(params.value as string) || ""
    },
  ],
};
