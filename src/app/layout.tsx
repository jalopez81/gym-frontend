import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gimnasio App',
  description: 'Aplicación de gestión de gimnasio'
}


export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
}