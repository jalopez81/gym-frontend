'use client';

import { createTheme } from '@mui/material/styles';

const config = JSON.parse(localStorage.getItem('config') || '{}');

const theme = createTheme({
  components: {
     MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'white',
        },
      },
    },
  },
  palette: {
    primary: {
      main: config?.colorPrincipal || '#a43f4a',
    },
    secondary: {
      main: config?.colorSecundario || '#ffcc29',
    },
  },
   typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h4:{
      margin: '0 0 2rem 0'
    }
  },
});

export default theme;