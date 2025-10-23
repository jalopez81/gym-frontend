import { Producto } from "@/types";
import { Box, Card, CardMedia, Typography } from "@mui/material";
import { CldImage } from 'next-cloudinary';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import { useState } from "react";
import { CardActions } from "./CardActions";

type Props = {
    producto: Producto;
};

export function ProductCard({ producto }: Props) {
    const [showInfo, setShowInfo] = useState(false)
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
            />
            <Box
                className="info-panel"
                onMouseEnter={() => setShowInfo(true)}
                onMouseLeave={() => setShowInfo(false)}
                sx={{
                    background: "#92879B",
                    height: "100%",
                    width: 300,
                    position: "absolute",
                    left: showInfo ? 0 : "70%",
                    bottom: showInfo ? 0 : "85%",
                    borderRadius: showInfo ? 0 : "10px 10px 10px 80px",
                    transition: 'all 300ms ease-in',
                }}
            >
                <InfoOutlineIcon
                    sx={{
                        position: 'absolute',
                        bottom: 30,
                        left: 40,
                        color: '#ffffff',
                        cursor: 'pointer'
                    }}
                />
            </Box>
            <CardActions producto={producto} />
        </Box>
    );
}
