export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  rol: string;
  creado: string;
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  categoria: string;
  creado: string;
  imagenSecureUrl: string;
  imagenPublicId: string;
  imagenUrl: string;
}

export type CrearProducto = Omit<Producto, "id" | "creado">

export interface Clase {
  id: string;
  nombre: string;
  descripcion?: string;
  duracion: number;
  capacidad: number;
  entrenadorId: string;
  creado: string;
}

export interface Sesion {
  id: string;
  claseId: string;
  fechaHora: string;
  creado: string;
}

export interface Reserva {
  id: string;
  clienteId: string;
  sesionId: string;
  estado: string;
  creado: string;
}

export interface Plan {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  duracionDias: number;
  beneficios?: string;
  creado: string;
}

export interface Suscripcion {
  id: string;
  usuarioId: string;
  planId: string;
  fechaInicio: string;
  fechaVencimiento: string;
  estado: string;
  creado: string;
}

export interface Orden {
  id: string;
  usuarioId: string;
  total: number;
  estado: string;
  items: OrdenItem[];
  creado: string;
}

export interface OrdenItem {
  id: string;
  ordenId: string;
  productoId: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface CarritoItem {
  cantidad: number;
  producto: Producto;
}

export interface AuthResponse {
  message: string;
  datos: {
    usuario: Usuario;
    token: string;
  };
}

export interface ProductPagination {
  total: number;
  pagina: number;
  busqueda: string;
  limite: number;
  totalPaginas: number;
}