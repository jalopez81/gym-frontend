import type { Metadata } from 'next';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme/theme';
import { Box } from '@mui/material';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/sidebar/Sidebar';

export const metadata: Metadata = {
  title: 'GYMPLUS',
  description: 'Aplicación de gestión de gimnasio'
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box sx={{ display: "flex", flex: 1 }}>
            <Sidebar />
            <Box display="flex" flexDirection="column" width="100%">
              <Navbar />              
              <Box component="main" sx={{ flexGrow: 1,  height: "calc(100vh - 64px)", overflow: 'auto'}}>
                {children}
              </Box>
            </Box>
          </Box>
        </ThemeProvider>
      </body>
    </html>
  );
}
