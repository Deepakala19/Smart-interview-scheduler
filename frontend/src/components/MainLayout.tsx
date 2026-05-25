import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardLayout from './Layout';

const MainLayout: React.FC = () => {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default MainLayout;
