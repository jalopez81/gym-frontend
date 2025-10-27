import { Producto } from "@/types";
import { Box } from "@mui/material";
import { CldImage } from 'next-cloudinary';


import { CardActions } from "./CardActions";
import { CardProductInfo } from "./CardProductInfo";

type Props = {
    producto: Producto;
};

export function ProductoCard({ producto }: Props) {
    
    return (
        <Box 
        className="product-card"
        sx={{
            width: 280,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '5px 5px 6px #dedede'
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CldImage
                src={producto.imagenSecureUrl}
                width={280}
                height={380}
                crop="auto"
                gravity="auto"
                quality="auto"
                alt="Producto"
                loading="lazy"
            />
            </Box>
            <CardProductInfo producto={producto}/>
            <CardActions producto={producto} />
        </Box>
    );
}
