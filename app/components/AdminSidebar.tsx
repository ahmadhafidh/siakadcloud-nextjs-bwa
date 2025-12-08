// app/components/pages/AdminSidebar.tsx
'use client'; 
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AdminSidebar = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <div className="main-sidebar sidebar-style-2">
      <aside id="sidebar-wrapper">
        <div className="sidebar-brand">
          <Link href="/pages/admin/dashboard">
            Stisla
          </Link>
        </div>
        <ul className="sidebar-menu">
          <li className={isActive('/pages/admin/dashboard') ? 'active' : ''}>
            <Link className="nav-link" href="/pages/admin/dashboard">
              <i className="ion-ios-home"></i>
              <span>Dashboard</span>
            </Link>
          </li>
          <li className="menu-header">Master</li>
          <li className={isActive('/pages/admin/fakultas') ? 'active' : ''}>
            <Link className="nav-link" href="/pages/admin/fakultas">
              <i className="ion-cube"></i>
              <span>Fakultas</span>
            </Link>
          </li>
          <li className={isActive('/pages/admin/prodi') ? 'active' : ''}>
            <Link className="nav-link" href="/pages/admin/prodi">
              <i className="ion-university"></i>
              <span>Program Studi</span>
            </Link>
          </li>
          <li className={isActive('/pages/admin/tahun-ajaran') ? 'active' : ''}>
            <Link className="nav-link" href="/pages/admin/tahun-ajaran">
              <i className="ion-ios-calendar"></i>
              <span>Tahun Ajaran</span>
            </Link>
          </li>
          {/* <li className={isActive('/pages/admin/kelas') ? 'active' : ''}>
            <Link className="nav-link" href="/pages/admin/kelas">
              <i className="ion-ios-bookmarks"></i>
              <span>Kelas</span>
            </Link>
          </li> */}
          <li className={isActive('/pages/admin/users') ? 'active' : ''}>
            <Link className="nav-link" href="/pages/admin/users">
              <i className="ion-ios-bookmarks"></i>
              <span>Users</span>
            </Link>
          </li>
          <li className={isActive('/pages/admin/peran') ? 'active' : ''}>
            <Link className="nav-link" href="/pages/admin/peran">
              <i className="ion-key"></i>
              <span>Peran</span>
            </Link>
          </li>
          <li className="menu-header">Pengguna</li>
          <li className={isActive('/pages/admin/mahasiswa') ? 'active' : ''}>
            <Link className="nav-link" href="/pages/admin/mahasiswa">
              <i className="ion-ios-people"></i>
              <span>Mahasiswa</span>
            </Link>
          </li>
          <li className={isActive('/pages/admin/dosen') ? 'active' : ''}>
            <Link className="nav-link" href="/pages/admin/dosen">
              <i className="ion-person-stalker"></i>
              <span>Dosen</span>
            </Link>
          </li>
          <li className="menu-header">Akademik</li>
          <li className={isActive('/pages/admin/matkul') ? 'active' : ''}>
            <Link className="nav-link" href="/pages/admin/matkul">
              <i className="ion-ios-book"></i>
              <span>Mata Kuliah</span>
            </Link>
          </li>
          <li className={isActive('/pages/admin/jadwal') ? 'active' : ''}>
            <Link className="nav-link" href="/pages/admin/jadwal">
              <i className="ion-calendar"></i>
              <span>Jadwal</span>
            </Link>
          </li>
          <li className="menu-header">Pembayaran</li>
          <li className={isActive('/pages/admin/ukt') ? 'active' : ''}>
            <Link className="nav-link" href="/pages/admin/ukt">
              <i className="ion-ios-calculator"></i>
              <span>Uang Kuliah Tunggal</span>
            </Link>
          </li>
          <li className={isActive('/pages/admin/golongan-ukt') ? 'active' : ''}>
            <Link className="nav-link" href="/pages/admin/golongan-ukt">
              <i className="ion-network"></i>
              <span>Golongan UKT</span>
            </Link>
          </li>
          <li className="menu-header">Lainnya</li>
          <li className={isActive('/pages/admin/krs') ? 'active' : ''}>
            <Link className="nav-link" href="/pages/admin/krs">
              <i className="ion-ios-list"></i>
              <span>Kartu Rencana Studi</span>
            </Link>
          </li>
          <li className={isActive('/pages/admin/khs') ? 'active' : ''}>
            <Link className="nav-link" href="/pages/admin/khs">
              <i className="ion-document-text"></i>
              <span>Kartu Hasil Studi</span>
            </Link>
          </li>
          <li className={isActive('/pages/admin/pembayaran') ? 'active' : ''}>
            <Link className="nav-link" href="/pages/admin/pembayaran">
              <i className="ion-cash"></i>
              <span>Pembayaran</span>
            </Link>
          </li>
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

export default AdminSidebar;
