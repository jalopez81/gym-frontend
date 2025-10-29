'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#a43f4a',
    },
    secondary: {
      main: '#ffcc29',
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



const defaultTheme = createTheme();
console.log(defaultTheme.typography);

export default theme;