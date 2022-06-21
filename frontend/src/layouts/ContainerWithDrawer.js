import { Outlet } from 'react-router-dom';
import * as React from 'react';


import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import { ListItemIcon } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import LinkIcon from '@mui/icons-material/Link';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import InfoIcon from '@mui/icons-material/Info';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useNavigate } from 'react-router-dom';


const screensList = [
  {name: 'Dashboard', screen: '/dashboard', Icon: DashboardIcon},
  {name: 'Metamask', screen: '/metamask', Icon: AccountBalanceWalletIcon},
  {name: 'NFT Data', screen: '/nft_data', Icon: InfoIcon},
  {name: 'NFT Owner', screen: '/nft_owner', Icon: AccountCircleIcon}
]

const TemporaryDrawer = ({isOpened, setIsOpened}) =>{
  const navigate = useNavigate();

  const toggleDrawer =
  (open) =>
  (event) => {
    if (
      event.type === 'keydown' &&
      ((event).key === 'Tab' ||
        (event).key === 'Shift')
    ) {
      return;
    }

    setIsOpened(open);
  };
  return (
    <Drawer
    anchor={'left'}
    open={isOpened}
     onClose={toggleDrawer(false)}
  >
  <Box
    sx={{ width: 250 }}
    role="presentation"
    onClick={toggleDrawer(false)}
    onKeyDown={toggleDrawer(false)}
  >
    <List>
      {screensList.map(({name, screen, Icon}, index) => (
        <ListItem  key={name} disablePadding>
          <ListItemButton onClick={()=>navigate(screen,{ replace: true })}>
            <ListItemIcon>
              <Icon/>
            </ListItemIcon>
            <ListItemText primary={name} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  </Box>
  </Drawer>
);
}

export default function ContainerWithDrawer({isOpened, setIsOpened}) {

  return (
    <>
            <TemporaryDrawer isOpened={isOpened} setIsOpened={setIsOpened}/>
            <Outlet />
      </>
  );
}
