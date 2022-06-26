import { default as React } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import CssBaseline from '@mui/material/CssBaseline';

import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

import './App.css';
import Router from './routes';

const themeLight = createTheme({
  palette: {
    background: {
      default: 'rgb(55 47 71)'
    }
  }
});

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider theme={themeLight}>
          <CssBaseline />
          <Router />
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
