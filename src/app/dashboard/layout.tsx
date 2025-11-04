"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const usuario = useAuthStore((s) => s.usuario);
  const router = useRouter();
  const [rehidrated, setRehydrated] = useState(false);

  useEffect(() => setRehydrated(true), []);
   useEffect(() => {
     if (rehidrated && !usuario) router.push("/login");
   }, [usuario, rehidrated, router]);

  if (!usuario) return null;
  return <>{children}</>
}
