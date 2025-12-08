import React from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import AdminSidebar from '../../components/AdminSidebar';

export const metadata = {
  title: "Dashboard Admin",
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div id="app">
      <div className="main-wrapper main-wrapper-1">
        <div className="navbar-bg"></div>
        <AdminNavbar />
        <AdminSidebar />
        <div className="main-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
