/** GET .../api/reportes/productos-mas-vendidos/ */
export type ReporteProductoMasVendido = {
  ranking: number;
  productoId: string;
  nombre: string;
  categoria: string;
  precioLista: number | null;
  unidadesVendidas: number;
  ingresosTotales: number;
  lineasEnOrdenes: number;
};

/** GET .../api/reportes/ventas-por-categoria/ */
export type ReporteVentasPorCategoria = {
  ranking: number;
  categoria: string;
  unidadesVendidas: number;
  ingresosTotales: number;
};

/** GET .../api/reportes/clases-mas-populares/ */
export type ReporteClasePopular = {
  ranking: number;
  claseId: string;
  nombre: string;
  capacidad: number;
  totalAsistencias: number;
  totalReservas: number;
};

/** GET .../api/reportes/entrenadores-mas-populares/ */
export type ReporteEntrenadorPopular = {
  ranking: number;
  entrenadorId: string;
  nombre: string;
  especialidad: string;
  totalAsistencias: number;
  totalReservas: number;
  clientesActivos: number;
};
