import React from 'react';
import DosenNavbar from '../../components/DosenNavbar';
import DosenSidebar from '../../components/DosenSidebar';

export const metadata = {
  title: "Dashboard Dosen",
};

const DosenLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div id="app">
      <div className="main-wrapper main-wrapper-1">
        <div className="navbar-bg"></div>
        <DosenNavbar />
        <DosenSidebar />
        <div className="main-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DosenLayout;
