// app/components/pages/MahasiswaSidebar.tsx
'use client'; 
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MahasiswaSidebar = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <div className="main-sidebar sidebar-style-2">
      <aside id="sidebar-wrapper">
        <div className="sidebar-brand">
          <Link href="/pages/mahasiswa/dashboard">
            Stisla
          </Link>
        </div>
        <ul className="sidebar-menu">
          <li className={isActive('/pages/mahasiswa/dashboard') ? 'active' : ''}>
            <Link className="nav-link" href="/pages/mahasiswa/dashboard">
              <i className="ion-ios-home"></i>
              <span>Dashboard</span>
            </Link>
          </li>
          <li className={isActive('/pages/mahasiswa/jadwal') ? 'active' : ''}>
            <Link className="nav-link" href="/pages/mahasiswa/jadwal">
              <i className="ion-ios-book"></i>
              <span>Jadwal</span>
            </Link>
          </li>
          <li className={isActive('/pages/mahasiswa/krs') ? 'active' : ''}>
            <Link className="nav-link" href="/pages/mahasiswa/krs">
              <i className="ion-ios-list"></i>
              <span>Kartu Rencana Studi</span>
            </Link>
          </li>
          <li className={isActive('/pages/mahasiswa/khs') ? 'active' : ''}>
            <Link className="nav-link" href="/pages/mahasiswa/khs">
              <i className="ion-document-text"></i>
              <span>Kartu Hasil Studi</span>
            </Link>
          </li>
          <li className={isActive('/pages/mahasiswa/pembayaran') ? 'active' : ''}>
            <Link className="nav-link" href="/pages/mahasiswa/pembayaran">
              <i className="ion-cash"></i>
              <span>Pembayaran</span>
            </Link>
          </li>
          <li>
            <Link className="nav-link" href="../login">
              <i className="ion-arrow-return-left"></i>
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default MahasiswaSidebar;
