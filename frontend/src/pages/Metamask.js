import React from 'react';
import Button from '@mui/material/Button';
import { Box, Typography } from '@mui/material';
import CustomAppBar from '../components/CustomAppBar';
import Background from '../components/Background';

function Metamask({ setIsOpened }) {
  return (
    <Background>
      <CustomAppBar setIsOpened={setIsOpened} title={'Connect to Metamask'} />

      <div style={{ height: '90px' }} />
      <Button
        style={{ top: '50%', backgroundColor: 'white' }}
        onClick={() => setIsOpened(p => !p)}
      >
        {'Open Menu'}
      </Button>

      <Typography
        component="h1"
        variant="h6"
        color="white"
        noWrap
        sx={{ flexGrow: 1 }}
      >
        Connect to metamask
      </Typography>
      <Typography
        component="h1"
        variant="h6"
        color="white"
        noWrap
        sx={{ flexGrow: 1 }}
      >
        Cumple con el requerimiento:
      </Typography>
      <Typography
        component="h1"
        variant="h6"
        color="white"
        noWrap
        sx={{ flexGrow: 1 }}
      >
        Conectarse con la wallet de MetaMask
      </Typography>
    </Background>
  );
}

export default Metamask;
