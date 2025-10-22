# API Endpoints (summary)

Base path: `/api` (except `/status`)

Auth

- POST /api/auth/registro
  - Body (required): `email` (email), `nombre` (min 3), `password` (min 6), `rol?`
- POST /api/auth/login
  - Body (required): `email`, `password`

Usuarios

- GET /api/usuarios/:id (protected)
- PUT /api/usuarios/actualizar-perfil (protected)
  - Body (optional): `nombre?`, `email?`
- PUT /api/usuarios/cambiar-password (protected)
  - Body: `passwordActual`, `passwordNuevo`
- GET /api/usuarios/ (admin-only)

Productos

- GET /api/productos
  - Query: `pagina`, `limite`, `busqueda`, `categoria`, `ordenarPor`, `orden`
- GET /api/productos/:id
- POST /api/productos/crear (admin-only)
  - Body: `nombre`, `precio`, `categoria` (required), `descripcion?`, `stock?`
- PUT /api/productos/actualizar/:id (admin-only)
  - Body: optional fields for product
- DELETE /api/productos/eliminar/:id (admin-only)

Planes

- GET /api/planes
- GET /api/planes/:id
- POST /api/planes (admin-only)
  - Body: `nombre`, `precio`, `duracionDias?`, `descripcion?`, `beneficios?`
- PUT /api/planes/:id (admin-only)
- DELETE /api/planes/:id (admin-only)

Suscripciones

- POST /api/suscripciones (protected)
  - Body: `planId` (uuid)
- GET /api/suscripciones/mi-suscripcion (protected)
- DELETE /api/suscripciones/:id (protected)
- POST /api/suscripciones/:id/renovar (protected)
- GET /api/suscripciones/ (admin-only)

Clases

- GET /api/clases
- GET /api/clases/:id
- POST /api/clases (admin-only)
  - Body: `nombre`, `capacidad`, `entrenadorId`, `duracion?`, `descripcion?`
- PUT /api/clases/:id (admin-only)
- DELETE /api/clases/:id (admin-only)

Sesiones

- GET /api/sesiones
- GET /api/sesiones/:id
- GET /api/sesiones/clase/:claseId
- POST /api/sesiones (admin-only)
  - Body: `claseId` (uuid), `fechaHora` (ISO datetime)
- PUT /api/sesiones/:id (admin-only)
  - Body: `fechaHora?`
- DELETE /api/sesiones/:id (admin-only)

Reservas

- GET /api/reservas/sesion/:sesionId
- POST /api/reservas (protected)
  - Body: `sesionId` (uuid)
- GET /api/reservas (protected) — user's reservations
- DELETE /api/reservas/:id (protected)
- GET /api/reservas/admin/todas (admin-only)

Asistencia

- GET /api/asistencia/sesion/:sesionId
- POST /api/asistencia (protected)
  - Body: `sesionId`, `clienteId`, `estado?` (`asistio` | `no_asistio` | `llego_tarde`), `horaEntrada?`
- GET /api/asistencia/mi-historial (protected)
- GET /api/asistencia/estadisticas/:clienteId (protected)
- GET /api/asistencia (admin-only)

Carrito

- POST /api/carrito (protected)
  - Body: `productoId` (uuid), `cantidad` (int >=1)
- GET /api/carrito (protected)
- PUT /api/carrito/:productoId (protected)
  - Body: `cantidad` (int >=1)
- DELETE /api/carrito/:productoId (protected)
- DELETE /api/carrito (protected)

Ordenes

- POST /api/ordenes (protected) — creates order from cart
- GET /api/ordenes/mis-ordenes (protected)
- GET /api/ordenes/:id (protected)
- POST /api/ordenes/:id/completar (protected)
- POST /api/ordenes/:id/cancelar (protected)
- GET /api/ordenes (admin-only)

Entrenadores

- GET /api/entrenadores
- GET /api/entrenadores/:id
- POST /api/entrenadores (admin-only)
  - Body: `usuarioId` (uuid), `especialidad`, `experiencia?`, `certificaciones?`
- PUT /api/entrenadores/:id (admin-only)
- DELETE /api/entrenadores/:id (admin-only)
- POST /api/entrenadores/asignar/cliente (admin-only)
  - Body: `entrenadorId`, `clienteId`
- POST /api/entrenadores/desasignar/cliente (admin-only)
  - Body: `entrenadorId`, `clienteId`

Reportes (admin-only)

- GET /api/reportes/usuarios
- GET /api/reportes/productos
- GET /api/reportes/ordenes
- GET /api/reportes/suscripciones
- GET /api/reportes/asistencia

Backups (admin-only)

- POST /api/backups/manual
- GET /api/backups
- POST /api/backups/:id/restaurar

Misc

- GET /status
