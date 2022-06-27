import React from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';

import { Button, IconButton, Typography } from '@mui/material';
import { useWallet } from '../providers/WalletProvider';

const adaptAddress = address => {
  return `${address.substring(0, 5)}…${address.substring(address.length - 4)}`;
};

const CustomAppBar = ({ title, setIsOpened }) => {
  const { connectMetamask, userAddress } = useWallet();

  return (
    <AppBar position="absolute" open={true}>
      <Toolbar
        sx={{
          textAlign: 'center',
          pr: '24px' // keep right padding when drawer closed
        }}
      >
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={() => setIsOpened(p => !p)}
        >
          <MenuIcon />
        </IconButton>
        <Typography component="h1" variant="h6" noWrap sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <Button
          style={{ backgroundColor: 'white' }}
          disabled={userAddress}
          onClick={connectMetamask}
        >
          {userAddress
            ? `Connected with: ${adaptAddress(userAddress)}`
            : 'Connect to Metamask'}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
