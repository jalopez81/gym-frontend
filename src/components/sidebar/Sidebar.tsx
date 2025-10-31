'use client'

import { useCartStore } from "@/store/cartStore";
import theme from "@/theme/theme";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { adminMenuItems, menuItems } from "./menu-items";
import { useAuthStore } from "@/store/authStore";


export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const { fetch: fetchCart } = useCartStore();
  const { usuario, ROLES } = useAuthStore();

  useEffect(() => {
    const fetchRemoteCart = async () => {
      await fetchCart();
    }

    fetchRemoteCart();
  }, [])

  const listItemStyle = {
    borderTop: `solid 1px ${primary}`,
    borderBottom: `solid 1px ${primary}`,
    transition: "all 200ms ease-in",
    padding: "2px 16px",
    "&.Mui-selected": {
      color: primary,
      backgroundColor: secondary,
      borderTop: `solid 1px ${secondary}`,
      borderBottom: `solid 1px ${secondary}`,
    },
    "&.Mui-selected:hover": {
      backgroundColor: secondary,
      filter: "brightness(95%)",
    },
    ':hover': {
      borderTopColor: secondary,
      borderBottomColor: secondary,
    }
  }

  return (
    <Box
      className="sidebar"
      sx={{
        position: 'sticky',
        alignSelf: 'flex-start',
        top: 0,
        zIndex: 10,
        height: "100vh",
        bgcolor: 'primary.main',
        width: open ? 250 : 55,
        transition: "all 300ms ease-in-out",
        color: "#ffffff",
      }}>

      {/* logo */}
      <Box className="logo container" sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: "1rem 0 2rem",
        position: 'relative',
        overflow: 'hidden'
      }}>
        <img style={{ opacity: `${open ? 1 : 0}`, height: 'auto', width: 150, position: 'absolute', top: 0, left: "50%", transform: 'translateX(-50%)', transition: 'all 300ms' }} src="logo-small.png" alt="logo" />
        <img style={{ opacity: `${open ? 0 : 1}`, height: 'auto', width: 40, position: 'absolute', top: 0, left: "50%", transform: 'translateX(-50%)', transition: 'all 300ms' }} src="logo-x-small.png" alt="logo" />
        <Typography variant="body2" sx={{ color: "#ffffff", mt: 7, opacity: `${open ? 1 : 0.5}`, fontSize: open ? "1rem" : 0, transition: 'all 300ms' }}>Supera tus límites</Typography>
      </Box>

      <List>{menuItems.map(item =>
        <Tooltip key={item.text} title={open ? "" : item.text} placement="right" arrow>
          <ListItemButton selected={isActive(item.href)} LinkComponent={Link} href={item.href} sx={listItemStyle}>
            <ListItemIcon sx={{ color: isActive(item.href) ? '#a43f4a' : "#ffffff", }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} sx={{ overflow: 'hidden', textOverflow: "ellipsis", whiteSpace: "nowrap" }} />
          </ListItemButton>
        </Tooltip>)}
      </List>

      {usuario?.rol === ROLES.ADMIN && <>
        <Typography variant="body2" sx={{ color: "#ffffff", mt: 7, opacity: `${open ? 1 : 0.5}`, fontSize: open ? "1rem" : 0, ml: 2, transition: 'all 300ms' }}>ADMINISTRADOR</Typography>
        <List>{adminMenuItems.map(item =>
          <Tooltip key={item.text} title={open ? "" : item.text} placement="right" arrow>
            <ListItemButton selected={isActive(item.href)} LinkComponent={Link} href={item.href} sx={listItemStyle}>
              <ListItemIcon sx={{ color: isActive(item.href) ? '#a43f4a' : "#ffffff", }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} sx={{ overflow: 'hidden', textOverflow: "ellipsis", whiteSpace: "nowrap" }} />
            </ListItemButton>
          </Tooltip>)}
        </List>
      </>}


      <Box
        className="btn-expandir"
        onClick={() => setOpen(!open)}
        sx={{
          background: 'rgba(196, 116, 125, 1)',
          borderRadius: '50%',
          color: 'white',
          cursor: 'pointer',
          fontWeight: 'bold',
          position: 'absolute',
          right: '-14px',
          top: '210px',
          transform: `rotate(${open ? 0 : 180}deg)`,
          transition: 'all 300ms ease-in',
          transitionDelay: "300ms",
          userSelect: "none",
          display: 'flex',
          justifyContent: 'center',
          padding: 0.5,
        }}
      >
        <ArrowBackIosIcon sx={{ fontSize: 18, transform: "translateX(4px)" }} />
      </Box>
    </Box>
  );
}
