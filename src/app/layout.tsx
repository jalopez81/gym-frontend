import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/sidebar/Sidebar';
import theme from '@/theme/theme';
import { Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GYM FiT',
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
            <Box className="root-layout__main-wrapper" sx={{ display: 'flex', flexDirection: 'column', overflow: "auto", width: "100%", background: '#f3f7f7'}}>
              <Navbar />
              <Box
                component="main"
                className="root-layout__main"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  background: "#ffffff"
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

