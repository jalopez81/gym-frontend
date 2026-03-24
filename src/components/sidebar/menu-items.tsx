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
  Check,
  ShoppingCart
} from '@mui/icons-material';

export const menuItems = [
  { textKey: 'menu_dashboard', icon: <Dashboard />, href: '/dashboard' },
  { textKey: 'menu_productos', icon: <ShoppingBag />, href: '/productos' },
  { textKey: 'menu_carrito', icon: <ShoppingCart />, href: '/carrito' },
  { textKey: 'menu_mis_ordenes', icon: <LocalShipping />, href: '/mis-ordenes' },
  { textKey: 'menu_planes', icon: <CardMembership />, href: '/planes' },
  { textKey: 'menu_clases', icon: <FitnessCenter />, href: '/clases' },
  { textKey: 'menu_entrenadores', icon: <People />, href: '/entrenadores' },
  { textKey: 'menu_mis_suscripciones', icon: <CardMembership />, href: '/suscripciones' },
];

export const adminMenuItems = [
  { textKey: 'menu_usuarios', icon: <People />, href: '/admin/usuarios' },
  { textKey: 'menu_suscripciones', icon: <CardMembership />, href: '/admin/suscripciones' },
  { textKey: 'menu_productos', icon: <ShoppingBag />, href: '/admin/productos' },
  { textKey: 'menu_ordenes', icon: <LocalShipping />, href: '/admin/ordenes' },
  { textKey: 'menu_clases', icon: <FitnessCenter />, href: '/admin/clases' },
  { textKey: 'menu_asistencias', icon: <Check />, href: '/admin/asistencias' },
  { textKey: 'menu_reportes', icon: <BarChart />, href: '/admin/reportes' },
  { textKey: 'menu_backups', icon: <Backup />, href: '/admin/backups' },
  { textKey: 'menu_configuracion', icon: <Settings />, href: '/admin/configuracion' },
];
