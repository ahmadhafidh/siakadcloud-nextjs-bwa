import React from 'react';
import MahasiswaNavbar from '../../components/MahasiswaNavbar';
import MahasiswaSidebar from '../../components/MahasiswaSidebar';

export const metadata = {
  title: "Dashboard Mahasiswa",
};

const MahasiswaLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div id="app">
      <div className="main-wrapper main-wrapper-1">
        <div className="navbar-bg"></div>
        <MahasiswaNavbar />
        <MahasiswaSidebar />
        <div className="main-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MahasiswaLayout;
