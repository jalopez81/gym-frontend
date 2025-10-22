import {
  Dashboard,
  ShoppingCart,
  FitnessCenter,
  ShoppingBag,
  LocalShipping,
  CardMembership,
  People,
  Assessment,
  Backup
} from '@mui/icons-material';

export const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, href: '/dashboard' },
    { text: 'Productos', icon: <ShoppingBag />, href: '/productos' },
    { text: 'Clases', icon: <FitnessCenter />, href: '/clases' },
    { text: 'Carrito', icon: <ShoppingCart />, href: '/carrito' },
    { text: 'Mis Órdenes', icon: <LocalShipping />, href: '/mis-ordenes' },
    { text: 'Suscripciones', icon: <CardMembership />, href: '/mis-suscripciones' }
  ];

  export const adminMenuItems = [
    { text: 'Usuarios', icon: <People />, href: '/admin/usuarios' },
    { text: 'Reportes', icon: <Assessment />, href: '/admin/reportes' },
    { text: 'Backups', icon: <Backup />, href: '/admin/backups' }
  ];
