import { Producto } from "@/types";
import { Box } from "@mui/material";
import { CldImage } from 'next-cloudinary';


import { CardActions } from "./CardActions";
import { CardProductInfo } from "./CardProductInfo";

type Props = {
    producto: Producto;
};

export function ProductCard({ producto }: Props) {
    
    return (
        <Box sx={{
            width: 280,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '5px 5px 6px #dedede'
        }}>
            <CldImage
                src="zapatos_ftdgpj.jpg"
                width={280}
                height={380}
                crop="fill"
                gravity="auto"
                quality="auto"
                alt="Producto"
                loading="lazy"
            />
            <CardProductInfo producto={producto}/>
            <CardActions producto={producto} />
        </Box>
    );
}
