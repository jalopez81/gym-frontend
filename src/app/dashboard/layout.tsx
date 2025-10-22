"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useAuthStore } from "@/store/authStore";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const usuario = useAuthStore((s) => s.usuario);
  const router = useRouter();
  const [rehidrated, setRehydrated] = useState(false);


  useEffect(() => {
    setRehydrated(true);
}, []);

  useEffect(() => {
      if (rehidrated && !usuario) router.push("/login");
  }, [usuario, rehidrated, router]);

  if (!usuario) return null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Box sx={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            ml: "240px",
            backgroundColor: "#f5f5f5",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
