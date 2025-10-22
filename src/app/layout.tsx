import type { Metadata } from 'next';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme/theme';

export const metadata: Metadata = {
  title: 'Gimnasio App',
  description: 'Aplicación de gestión de gimnasio'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
            {children}
        </ThemeProvider>
      </body>
    </html>
  );
}