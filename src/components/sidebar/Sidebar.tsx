'use client'

import { useCartStore } from "@/store/cartStore";
import theme from "@/theme/theme";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography } from "@mui/material";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useEffect, useState } from "react";
import { adminMenuItems, menuItems } from "./menu-items";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";
import { useTranslations } from 'next-intl';
import { useBreakpoints } from '@/utils/useMediaQuery';

export default function Sidebar() {
  const { isMobile } = useBreakpoints();
  const [open, setOpen] = useState(!isMobile);
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const { fetch: fetchCart } = useCartStore();
  const { usuario, ROLES, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const t = useTranslations('Sidebar');

  useEffect(() => {
    const fetchRemoteCart = async () => {
      if (isAuthenticated()) {
        await fetchCart();
      }
    }
    fetchRemoteCart();
  }, [fetchCart, isAuthenticated])

  const handleNavigation = (href: string) => {
    if (isMobile) setOpen(false);
    router.push(href);
  };

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
    <>
      {isMobile && open && (
        <Box
          onClick={() => setOpen(false)}
          sx={{
            position: 'fixed',
            inset: 0,
            bgcolor: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(2px)',
            zIndex: 11,
          }}
        />
      )}

      <Box
        className="sidebar"
        sx={{
          position: isMobile ? 'fixed' : 'sticky',
          alignSelf: 'flex-start',
          top: 0,
          left: 0,
          zIndex: 12,
          height: "100vh",
          bgcolor: 'primary.main',
          width: open ? 250 : 55,
          transition: "width 300ms ease-in-out",
          color: "#ffffff",
          boxShadow: (isMobile && open) ? '5px 0px 15px rgba(0,0,0,0.2)' : 'none',
          
          overflow: 'visible', 
        }}>

        <Box className="logo container" sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: "1rem 0 2rem",
          position: 'relative',
          overflow: 'hidden', 
          cursor: 'pointer',
        }}
          onClick={() => handleNavigation("/")}
        >
          <Image
            src="/logo-small.png"
            alt="Logo principal"
            width={150}
            height={40}
            style={{
              opacity: open ? 1 : 0,
              position: 'absolute',
              top: 0,
            left: "50%",
              transform: 'translateX(-50%)',
              transition: 'opacity 300ms'
            }}
            priority
          />

          <Image
            src="/logo-x-small.png"
            alt="Logo icono"
            width={40}
            height={40}
            style={{
              opacity: open ? 0 : 1,
              position: 'absolute',
              top: 0,
            left: "50%",
              transform: 'translateX(-50%)',
              transition: 'opacity 300ms'
            }}
          />
          <Typography variant="body2" sx={{ color: "#ffffff", mt: 7, opacity: `${open ? 1 : 0}`, fontSize: open ? "1rem" : 0, transition: 'all 300ms' }}>{t('slogan')}</Typography>
        </Box>

        <Box className="items-container" sx={{ 
          overflowY: 'auto', 
          overflowX: 'hidden', 
          height: 'calc(100vh - 150px)', 
          scrollbarWidth: 'none' 
        }}>
          <List>{menuItems.map(item =>
            <Tooltip key={item.textKey} title={open ? "" : t(item.textKey as any)} placement="right" arrow>
              <ListItemButton selected={isActive(item.href)} onClick={() => handleNavigation(item.href)} sx={listItemStyle}>
                <ListItemIcon sx={{ color: isActive(item.href) ? '#a43f4a' : "#ffffff", }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={t(item.textKey as any)} 
                  sx={{ 
                    overflow: 'hidden', 
                    textOverflow: "ellipsis", 
                    whiteSpace: "nowrap",
                    opacity: open ? 1 : 0,
                    transition: 'opacity 200ms'
                  }}
                  primaryTypographyProps={{ fontSize: '0.8rem' }} />
              </ListItemButton>
            </Tooltip>)}
          </List>

          {usuario?.rol === ROLES.ADMIN && <>
            <Typography variant="body2" sx={{ color: "#ffffff", mt: 7, opacity: `${open ? 1 : 0}`, fontSize: open ? "1rem" : 0, ml: 2, transition: 'all 300ms' }}>{t('adminTitle')}</Typography>
            <List>{adminMenuItems.map(item =>
              <Tooltip key={item.textKey} title={open ? "" : t(item.textKey as any)} placement="right" arrow>
                <ListItemButton selected={isActive(item.href)} onClick={() => handleNavigation(item.href)} sx={listItemStyle}>
                  <ListItemIcon sx={{ color: isActive(item.href) ? '#a43f4a' : "#ffffff", }}>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={t(item.textKey as any)} 
                    sx={{ 
                      overflow: 'hidden', 
                      textOverflow: "ellipsis", 
                      whiteSpace: "nowrap",
                      opacity: open ? 1 : 0
                    }}
                    primaryTypographyProps={{ fontSize: '0.8rem' }}
                  />
                </ListItemButton>
              </Tooltip>)}
            </List>
          </>}
        </Box>

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
            zIndex: 13
          }}
        >
          <ArrowBackIosIcon sx={{ fontSize: 18, transform: "translateX(4px)" }} />
        </Box>
      </Box>
    </>
  );
}