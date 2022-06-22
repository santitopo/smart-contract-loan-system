import { useState } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import ContainerWithDrawer from './layouts/ContainerWithDrawer';
import Dashboard from './pages/Dashboard';
import Metamask from './pages/Metamask';

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
        { path: '/', element: <Navigate to="/dashboard" replace /> },
        {
          path: 'dashboard',
          element: <Dashboard setIsOpened={setDrawerOpened} />
        },
        {
          path: 'metamask',
          element: <Metamask setIsOpened={setDrawerOpened} />
        },
        {
          path: 'nft_data',
          element: <Dashboard setIsOpened={setDrawerOpened} />
        },
        {
          path: 'nft_owner',
          element: <Dashboard setIsOpened={setDrawerOpened} />
        }
      ]
    }
  ]);
}
