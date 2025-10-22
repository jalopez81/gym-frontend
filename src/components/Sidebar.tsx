'use client';

import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography
} from '@mui/material';
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
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

const drawerWidth = 240;

export default function Sidebar() {
  const usuario = useAuthStore(s => s.usuario)
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;
  const esAdmin = usuario?.rol === 'admin';

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, href: '/dashboard' },
    { text: 'Productos', icon: <ShoppingBag />, href: '/productos' },
    { text: 'Clases', icon: <FitnessCenter />, href: '/clases' },
    { text: 'Carrito', icon: <ShoppingCart />, href: '/carrito' },
    { text: 'Mis Órdenes', icon: <LocalShipping />, href: '/mis-ordenes' },
    { text: 'Suscripciones', icon: <CardMembership />, href: '/mis-suscripciones' }
  ];

  const adminMenuItems = [
    { text: 'Usuarios', icon: <People />, href: '/admin/usuarios' },
    { text: 'Reportes', icon: <Assessment />, href: '/admin/reportes' },
    { text: 'Backups', icon: <Backup />, href: '/admin/backups' }
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          top: '64px',
          height: 'calc(100% - 64px)'
        }
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={isActive(item.href)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {esAdmin && (
          <>
            <Divider />
            <Box sx={{ p: 2 }}>
              <Typography variant="overline" color="text.secondary" fontWeight="bold">
                ADMINISTRACIÓN
              </Typography>
            </Box>
            <List>
              {adminMenuItems.map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    component={Link}
                    href={item.href}
                    selected={isActive(item.href)}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Box>
    </Drawer>
  );
}