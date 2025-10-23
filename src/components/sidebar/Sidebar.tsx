'use client'

import { Box, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useState } from "react";
import { menuItems } from "./menu-items";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <Box
      className="sidebar"
      sx={{
        position: 'relative',
        background: 'rgb(164, 63, 74)',
        width: open ? 250 : 55,
        transition: "all 300ms ease-in-out",
        color: "#ffffff",
      }}>

      <List>{menuItems.map(item =>
        <ListItemButton key={item.text} selected={isActive(item.href)}
          LinkComponent={Link}
          href={item.href}
          sx={{
            "&.Mui-selected": {
              color: 'rgb(164, 63, 74)',
              backgroundColor: "rgba(255,255,255,0.8)",
            },
            "&.Mui-selected:hover": {
              backgroundColor: "rgba(255,255,255,0.8)",
            },
            transition: "all 50ms ease-in",
            ':hover': {
              transform: 'translate(1px, -1px)'
            }
          }}
        >
          <ListItemIcon 
          sx={{ 
            color: isActive(item.href) ? 'rgb(164, 63, 74)' : "#ffffff",           
          }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.text} sx={{ overflow: 'hidden', textOverflow: "ellipsis", whiteSpace: "nowrap" }} />
        </ListItemButton>)}
      </List>

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
          top: '80px',
          transform: `rotate(${open ? 180 : 0}deg)`,
          transition: 'all 300ms ease-in',
          transitionDelay: "300ms",
          userSelect: "none",
          display: 'flex', 
          justifyContent: 'center',
          padding: 0.5, 
        }}
      >
        <ArrowBackIosIcon sx={{fontSize: 18, transform: "translateX(4px)"}}/>
      </Box>
    </Box>
  );
}
