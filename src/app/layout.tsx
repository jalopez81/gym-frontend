import type { Metadata } from 'next';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme/theme';
import { Box } from '@mui/material';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/sidebar/Sidebar';
import Footer from '@/components/Footer';

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
          <Box className="root-layout__container" sx={{ display: "flex", flex: 1, height: "100vh", overflow: "hidden" }}>
            <Sidebar />
            <Box className="root-layout__main-wrapper" sx={{ display: 'flex', flexDirection: 'column', overflow: "auto"}}>
              <Navbar />
              <Box
                component="main"
                className="root-layout__main"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1                  
                }}
              >
                {children}
              </Box>
              <Footer />
            </Box>
          </Box>
        </ThemeProvider>
      </body>
    </html>
  );
}

