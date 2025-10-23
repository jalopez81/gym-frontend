import { Producto } from '@/types';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import { Box, Typography } from "@mui/material";
import { useState } from "react";


type Props = {
    producto: Producto;
};

export const CardProductInfo = ({ producto }: Props) => {
    const [showInfo, setShowInfo] = useState(false)

    return (
        <Box
            className="info-panel"
            onMouseEnter={() => setShowInfo(true)}
            onMouseLeave={() => setShowInfo(false)}
            sx={{
                background: "#92879B",
                height: "90%",
                width: 280,
                position: "absolute",
                left: showInfo ? 0 : "70%",
                bottom: showInfo ? "15%" : "85%",
                borderRadius: showInfo ? 0 : "10px 10px 10px 80px",
                transition: 'all 300ms ease-in',
                color: "#ffffff",
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: "1rem"
            }}
        >
            <Typography sx={{ textAlign: 'center', fontSize: "1.3rem"}}
            >{producto.descripcion}</Typography>
            <InfoOutlineIcon
                sx={{
                    position: 'absolute',
                    bottom: 30,
                    left: 40,
                    cursor: 'pointer',
                    transition: "all 1300ms",
                    opacity: showInfo ? 0 : 1
                }}
            />
        </Box>
    )
}