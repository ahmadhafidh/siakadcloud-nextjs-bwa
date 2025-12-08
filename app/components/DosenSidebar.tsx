// app/components/pages/DosenSidebar.tsx
'use client'; 
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const DosenSidebar = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href;
  };

  const isMatkulActive = () => {
    return (
      pathname.startsWith('/pages/dosen/matkul') ||
      pathname.startsWith('/pages/dosen/pilihkelas') ||
      pathname.startsWith('/pages/dosen/pilihmatkul')
    );
  };


  return (
    <div className="main-sidebar sidebar-style-2">
      <aside id="sidebar-wrapper">
        <div className="sidebar-brand">
          <Link href="/pages/dosen/dashboard">
            Stisla
          </Link>
        </div>
        <ul className="sidebar-menu">
          <li className={isActive('/pages/dosen/dashboard') ? 'active' : ''}>
            <Link className="nav-link" href="/pages/dosen/dashboard">
              <i className="ion-ios-home"></i>
              <span>Dashboard</span>
            </Link>
          </li>
          <li className="menu-header">Akademik</li>
           <li className={isMatkulActive() ? 'active' : ''}>
            <Link className="nav-link" href="/pages/dosen/matkul">
                <i className="ion-ios-book"></i>
                <span>Mata Kuliah</span>
            </Link>
            </li>
          <li className={isActive('/pages/dosen/jadwal') ? 'active' : ''}>
            <Link className="nav-link" href="/pages/dosen/jadwal">
              <i className="ion-calendar"></i>
              <span>Jadwal</span>
            </Link>
          </li>
          <li className={isActive('/pages/dosen/krs') ? 'active' : ''}>
            <Link className="nav-link" href="/pages/dosen/krs">
              <i className="ion-ios-list"></i>
              <span>Kartu Rencana Studi</span>
            </Link>
          </li>
          <li className="menu-header">Lainnya</li>
          <li>
            <Link className="nav-link" href="/login">
              <i className="ion-arrow-return-left"></i>
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default DosenSidebar;
