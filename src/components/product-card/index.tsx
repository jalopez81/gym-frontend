import { Producto } from "@/types";
import { Box, Paper, Typography } from "@mui/material";
import { CldImage } from 'next-cloudinary';


import { CardActions } from "./CardActions";
import { CardProductInfo } from "./CardProductInfo";

type Props = {
    producto: Producto;
};

export function ProductoCard({ producto }: Props) {

    if(producto.imagenSecureUrl === "") return null;
    
    return (
       <Paper 
            elevation={2}
            className="product-card"
            sx={{
                width: '100%',
                maxWidth: 280, // Limits size on desktop
                margin: 'auto',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                background: "#ffffff",
                borderRadius: 2, // Modern touch
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' }
            }}
        >
            <Box sx={{ width: '100%', aspectRatio: '280/380', position: 'relative', overflow: 'hidden' }}>
                {producto.categoria ? (
                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      zIndex: 1,
                      px: 1,
                      py: 0.35,
                      borderRadius: 1,
                      bgcolor: 'rgba(255,255,255,0.88)',
                      color: 'text.secondary',
                      fontWeight: 600,
                      lineHeight: 1.2,
                      maxWidth: 'calc(100% - 16px)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                    }}
                  >
                    {producto.categoria}
                  </Typography>
                ) : null}
                <CldImage
                    src={producto.imagenSecureUrl}
                    fill
                    sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 280px"
                    style={{ objectFit: 'cover' }}
                    quality="auto"
                    alt={producto.nombre}
                    loading="lazy"
                />
            </Box>
            
            <CardProductInfo producto={producto}/>
            <CardActions producto={producto} />
        </Paper>
    );
}
