import React from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';

import { IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';

const CustomAppBar = ({ title }) => {
  return (
    <AppBar position="absolute" open={true}>
      <Toolbar
        sx={{
          textAlign: 'center',
          pr: '24px' // keep right padding when drawer closed
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          sx={{
            marginRight: '36px',
            ...(open && { display: 'none' })
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography component="h1" variant="h6" noWrap sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
