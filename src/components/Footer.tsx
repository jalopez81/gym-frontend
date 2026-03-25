import { Box, Typography, Link } from '@mui/material';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');
  return (
    <Box
      component="footer"
      className="root-layout__footer"
      sx={{
        backgroundColor: '#1976d2', // MUI primary color
        color: '#fff',
        py: 2,
        px: { xs: 2, md: 4 },
        mt: 'auto',
        textAlign: 'center',
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} PROFIT. {t('rightsReserved')}        
      </Typography>      
      <Typography variant="body2" sx={{ mt: 0.5 }}>
        <Link href="/privacy" color="inherit" underline="hover">
          {t('privacyPolicy')}
        </Link>{' '}
        |{' '}
        <Link href="/terms" color="inherit" underline="hover">
          {t('termsAndConditions')}
        </Link>
      </Typography>
    </Box>
  );
}
