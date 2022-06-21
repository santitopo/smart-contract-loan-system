import {useState} from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import ContainerWithDrawer from './layouts/ContainerWithDrawer';
import Dashboard from './pages/Dashboard';

export default function Router(props) {
  const [isDrawerOpened, setDrawerOpened] = useState(false);

  return useRoutes([
    {
      path: '/',
      element: <ContainerWithDrawer isOpened={isDrawerOpened} setIsOpened={setDrawerOpened}/>,
      children: [
        { path: '/', element: <Navigate to="/dashboard" replace /> },
        { path: 'dashboard', element: <Dashboard setIsOpened={setDrawerOpened}/> },
        { path: 'metamask', element: <Dashboard setIsOpened={setDrawerOpened} /> },
        { path: 'nft_data', element: <Dashboard setIsOpened={setDrawerOpened}/> },
        { path: 'nft_owner', element: <Dashboard setIsOpened={setDrawerOpened} /> },
      ]
    }
  ]);
}
