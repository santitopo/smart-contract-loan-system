import { useState } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import ContainerWithDrawer from './layouts/ContainerWithDrawer';
import NFTContractControlPanel from './pages/NFTContractControlPanel';
import Metamask from './pages/Metamask';
import NFTData from './pages/NFTData';
import NFTOwner from './pages/NFTOwner';
import LoanContractControlPanel from './pages/LoanContractControlPanel';

export default function Router(props) {
  const [isDrawerOpened, setDrawerOpened] = useState(false);

  return useRoutes([
    {
      path: '/',
      element: (
        <ContainerWithDrawer
          isOpened={isDrawerOpened}
          setIsOpened={setDrawerOpened}
        />
      ),
      children: [
        { path: '/', element: <Navigate to="/nftcontract" replace /> },
        {
          path: 'nftcontract',
          element: <NFTContractControlPanel setIsOpened={setDrawerOpened} />
        },
        {
          path: 'loanContract',
          element: <LoanContractControlPanel setIsOpened={setDrawerOpened} />
        },
        {
          path: 'metamask',
          element: <Metamask setIsOpened={setDrawerOpened} />
        },
        {
          path: 'nft_data',
          element: <NFTData setIsOpened={setDrawerOpened} />
        },
        {
          path: 'nft_owner',
          element: <NFTOwner setIsOpened={setDrawerOpened} />
        }
      ]
    }
  ]);
}
