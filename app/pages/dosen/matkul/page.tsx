'use client';
import React, { useState } from 'react';

const MatkulDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const mataKuliah = [
    {
      title: "Algoritma dan Pemrograman",
      fakultas: "Fakultas Ilmu Komputer",
      prodi: "Informatika",
      sks: 3,
      semester: 1
    },
    {
      title: "Struktur Data",
      fakultas: "Fakultas Ilmu Komputer",
      prodi: "Informatika",
      sks: 3,
      semester: 1
    },
    {
      title: "Pemrograman Web",
      fakultas: "Fakultas Ilmu Komputer",
      prodi: "Informatika",
      sks: 3,
      semester: 1
    }
  ];

  // Filter mataKuliah berdasarkan searchQuery
  const filteredMataKuliah = mataKuliah.filter(mk =>
    mk.title.toLowerCase().includes(searchQuery)
  );

  return (
    <section className="section">
      <div className="section-header">
        <h1>Akademik</h1>
      </div>

      <div className="section-body">
        <h2 className="section-title">Mata Kuliah</h2>
        <p className="section-lead">
          Menampilkan semua data mata kuliah yang anda ampu
        </p>

        <div className="row mb-4">
          <div className="col-md-6">
            <div className="position-relative">
              <i className="fas fa-search position-absolute" style={{ top: "50%", right: 15, transform: "translateY(-50%)", color: "#aaa" }}></i>
              <input
                type="text"
                id="searchInput"
                className="form-control pr-5"
                placeholder="Cari mata kuliah..."
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className="col-md-6 text-right">
            <button className="btn btn-primary">
              <i className="fas fa-sync-alt"></i> Refresh
            </button>
          </div>
        </div>

        <div className="row">
          {filteredMataKuliah.map((mk, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="card card-primary">
                <div className="card-header d-flex justify-content-between align-items-center border-bottom">
                  <a href="/pages/dosen/pilihmatkul" className="text-decoration-none text-dark">
                    <h6 className="mb-0">{mk.title}</h6>
                  </a>
                  <div className="dropdown">
                    <a href="#" data-toggle="dropdown">
                      <i className="fas fa-ellipsis-v"></i>
                    </a>
                    <div className="dropdown-menu dropdown-menu-right">
                      <a className="dropdown-item" href="#">Edit</a>
                      <a className="dropdown-item" href="#">Hapus</a>
                    </div>
                  </div>
                </div>
                <div className="card-body p-3">
                  <table className="table table-sm mb-0">
                    <tbody>
                      <tr>
                        <td>Fakultas</td>
                        <td><strong>{mk.fakultas}</strong></td>
                      </tr>
                      <tr>
                        <td>Program Studi</td>
                        <td><strong>{mk.prodi}</strong></td>
                      </tr>
                      <tr>
                        <td>SKS</td>
                        <td><strong>{mk.sks}</strong></td>
                      </tr>
                      <tr>
                        <td>Semester</td>
                        <td><strong>{mk.semester}</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MatkulDashboard;
