import { Producto } from "@/types";
import { Card, CardMedia } from "@mui/material";

type Props = {
    producto: Producto;
};

export function ProductCard({ producto }: Props) {
    return (
        <Card>
            <CardMedia
                component="img"
                height="140"
                image="/mat.jpg"
                alt={producto.descripcion}
            />

            
        </Card>
    );
}
