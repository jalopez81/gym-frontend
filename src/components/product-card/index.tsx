import { Producto } from "@/types";
import { Box, Paper } from "@mui/material";
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
                <CldImage
                    src={producto.imagenSecureUrl}
                    fill // Makes it responsive to the parent container
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
