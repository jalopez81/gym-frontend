import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/sidebar/Sidebar';
import theme from '@/theme/theme';
import { Box } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from "next/navigation";
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PRO FiT',
  description: 'Aplicación de gestión de gimnasio'
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client side
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Box className="root-layout__container" sx={{ display: "flex", flex: 1, height: "100vh", overflow: "hidden" }}>
                <Sidebar />
                <Box className="root-layout__main-wrapper" sx={{ display: 'flex', flexDirection: 'column', overflow: "auto", width: "100%", background: '#f3f7f7'}}>
                  <Navbar />
                  <Box component="main" className="root-layout__main" sx={{ display: 'flex', flexDirection: 'column', flex: 1, background: "#ffffff" }}>
                    {children}
                  </Box>
                  <Footer />
                </Box>
              </Box>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}