import {
  Backup,
  BarChart,
  CardMembership,
  Dashboard,
  FitnessCenter,
  LocalShipping,
  People,
  Settings,
  ShoppingBag,
  ShoppingCart
} from '@mui/icons-material';

export const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, href: '/dashboard' },
  { text: 'Productos', icon: <ShoppingBag />, href: '/productos' },
  { text: 'Carrito', icon: <ShoppingCart />, href: '/carrito' },
  { text: 'Mis Órdenes', icon: <LocalShipping />, href: '/mis-ordenes' },
  { text: 'Clases', icon: <FitnessCenter />, href: '/clases' },
  { text: 'Entrenadores', icon: <People />, href: '/entrenadores' },
  { text: 'Mis Suscripciones', icon: <CardMembership />, href: '/mis-suscripciones' },
];

export const adminMenuItems = [
  { text: 'Usuarios', icon: <People />, href: '/admin/usuarios' },
  { text: 'Productos', icon: <ShoppingBag />, href: '/admin/productos' },
  { text: 'Clases', icon: <FitnessCenter />, href: '/admin/clases' },
  { text: 'Reportes', icon: <BarChart />, href: '/admin/reportes' },
  { text: 'Backups', icon: <Backup />, href: '/admin/backups' },
  { text: 'Configuración', icon: <Settings />, href: '/admin/configuracion' },
];
