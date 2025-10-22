"use client"; 

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
} from "@mui/material";
import apiClient from "@/lib/apiClient";
import { ProductCard } from "@/components/product-card/ProductCard";
import { Producto } from "@/types";


const dummyData: any = {
    "mensaje": "Productos obtenidos exitosamente",
    "datos": {
        "productos": [
            {
                "id": "902b8004-5136-4937-a3c4-6a725d8488c4",
                "nombre": "Mat de yoga",
                "descripcion": "Tapete antideslizante de 6mm",
                "precio": 34.99,
                "stock": 45,
                "categoria": "Accesorios",
                "creado": "2025-10-17T03:12:03.754Z"
            },
            {
                "id": "d36d0146-9e86-48b7-b1cd-d8393d6d3ae4",
                "nombre": "Mancuerna ajustable",
                "descripcion": "Mancuerna de 2.5 a 15 kg",
                "precio": 89.99,
                "stock": 18,
                "categoria": "Equipos",
                "creado": "2025-10-17T03:12:03.750Z"
            },
            {
                "id": "b522287d-23ab-463f-9181-831096cc66d7",
                "nombre": "Protector de rodillas",
                "descripcion": "Protección para entrenamiento intenso",
                "precio": 22.99,
                "stock": 35,
                "categoria": "Protección",
                "creado": "2025-10-17T03:12:03.748Z"
            },
            {
                "id": "8b3171c0-3da7-439e-874f-d368c39e1a81",
                "nombre": "Camiseta deportiva",
                "descripcion": "Camiseta de secado rápido",
                "precio": 29.99,
                "stock": 80,
                "categoria": "Ropa",
                "creado": "2025-10-17T03:12:03.746Z"
            },
            {
                "id": "df811f5f-23b4-4576-9681-e8b8b8a45a3b",
                "nombre": "Banda elástica de resistencia",
                "descripcion": "Set de 5 bandas de diferentes resistencias",
                "precio": 19.99,
                "stock": 40,
                "categoria": "Accesorios",
                "creado": "2025-10-17T03:12:03.742Z"
            },
            {
                "id": "38338c64-555e-4cea-9a5b-f749ddcf24f9",
                "nombre": "Proteína Whey",
                "descripcion": "Proteína de suero de 2kg",
                "precio": 45.99,
                "stock": 30,
                "categoria": "Suplementos",
                "creado": "2025-10-17T03:12:03.739Z"
            },
            {
                "id": "322368da-0d84-41aa-b14d-fbd1f3640ad3",
                "nombre": "Botella de agua deportiva",
                "descripcion": "Botella reutilizable de 1 litro",
                "precio": 15.99,
                "stock": 100,
                "categoria": "Accesorios",
                "creado": "2025-10-17T03:12:03.736Z"
            },
            {
                "id": "1602b30b-1e4e-4b32-8e18-a68bb15c841a",
                "nombre": "Guantes de entrenamiento",
                "descripcion": "Guantes profesionales para levantamiento de pesas",
                "precio": 25.99,
                "stock": 50,
                "categoria": "Accesorios",
                "creado": "2025-10-17T03:12:03.731Z"
            },
            {
                "id": "8bfc91da-e43a-4f83-a60a-d41829ebae78",
                "nombre": "borrar este producto 33",
                "descripcion": "Galletas de trigo sin azucar",
                "precio": 21,
                "stock": 17,
                "categoria": "alimentos",
                "creado": "2025-10-14T16:54:29.864Z"
            },
            {
                "id": "bf7a60d9-b221-4810-87af-34378af32c89",
                "nombre": "borrar este producto 33",
                "descripcion": "Galletas de trigo sin azucar",
                "precio": 21,
                "stock": 17,
                "categoria": "alimentos",
                "creado": "2025-10-14T16:53:55.198Z"
            }
        ],
        "paginacion": {
            "total": 19,
            "pagina": 1,
            "limite": 10,
            "totalPaginas": 2
        }
    }
}

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>(dummyData.datos.productos);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProductos() {
      setLoading(true);
      setError(null);
      try {
        // const { data } = await apiClient.get("/productos?pagina=1&limite=10");
        // setProductos(data.datos.productos);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProductos();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Listado de Productos
      </Typography>
      <Grid container spacing={3} sx={{ background: "#E3E3D8" }}>
        {productos.map((producto) => (
          <Grid item xs={12} sm={6} md={4} key={producto.id}>
            <ProductCard producto={producto} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}