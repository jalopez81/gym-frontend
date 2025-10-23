import { Box, Typography } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import { Producto } from "@/types";

type Props = {
    producto: Producto;
};

const classes = {
    root: (added: boolean) => ({
        height: 80,
        display: "flex",
        paddingLeft: "12px",
        transition: "all 300ms ease-in",
        transform: `translateX(${added ? -285 : 0}px)`,
        background: "#ffffff",
    }),
    priceInfo: {
        display: "flex",
        flexDirection: "column",
    },
    name: {
        fontSize: "1.3rem",
        fontWeight: "500",
        marginTop: '8px',
        width: 185,
        height: "3rem",
        marginRight: "12px",
        lineHeight: "1.4rem",
        top: 5,
    },
    price: {
        bottom: 5,
    },
    addButton: {
        right: 0,
        top: -7,
        height: 80,
        display: "flex",
        alignItems: "center",
        padding: 3,
        background: "#bbd7df",
        cursor: "pointer",
        "&:hover": {
            background: '#8cbcd1ff',
        }
    },
    removeButton: {
        background: '#A6CDDE',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'clip'
    },
    removeButtonIcon1: (hovered: boolean) => ({
        background: '#8cbcd1ff',
        padding: 3,
        transition: "all 300ms ease-in",
        transform: `translateY(${hovered ? -50 : 0}px)`
    }),
    removeButtonIcon2: (hovered: boolean) => ({
        background: 'red',
        padding: 3,
        transition: "all 300ms ease-in",
        transform: `translateY(${hovered ? -80 : 0}px)`

    }),
    icon: { fontSize: 30, color: "#ffffff", cursor: "pointer" },
    addedToCart: {

    },
    addedToCartInfo: {
        background: '#A6CDDE',
        color: "#ffffff",
        paddingLeft: "1rem",
        paddingRight: "2rem",
    }
};

export const CardActions = ({ producto }: Props) => {
    const [added, setAdded] = useState(false);
    const [hovered, setHovered] = useState(false);

    const switchHovered = (value: boolean) => {
        setHovered(value)
    }

    return (
        <Box sx={classes.root(added)} className="test-root">
            <Box sx={classes.priceInfo}>
                <Typography sx={classes.name}>{producto.nombre}</Typography>
                <Typography sx={classes.price}>${producto.precio}</Typography>
            </Box>

            <Box sx={classes.addButton} onClick={() => setAdded(!added)}>
                <AddShoppingCartIcon />
            </Box>

            <Box
                sx={classes.removeButton}
                onMouseEnter={() => switchHovered(true)}
                onMouseLeave={() => switchHovered(false)}>
                <Box sx={classes.removeButtonIcon1(hovered)}><CheckIcon sx={classes.icon} /></Box>
                <Box sx={classes.removeButtonIcon2(hovered)} onClick={() => setAdded(false)}><CloseIcon sx={classes.icon} /></Box>
            </Box>

            <Box sx={classes.addedToCartInfo}>
                <Typography sx={classes.name}>{producto.nombre}</Typography>
                <Typography sx={classes.addedToCart}>Añadido al carrito</Typography>
            </Box>
        </Box>
    );
};
