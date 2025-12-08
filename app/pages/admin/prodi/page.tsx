'use client';
import React, { useState } from 'react';

const ProdiPage = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProdi, setSelectedProdi] = useState({ fakultas: '', nama: '', kode: '' });
  const [newProdi, setNewProdi] = useState({ fakultas: '', nama: '', kode: '' });
  const [prodiList, setProdiList] = useState([
    { id: 1, fakultas: 'Fakultas Teknik', nama: 'Teknik Informatika', kode: '2018178', dibuat: 'Rabu, 12 Januari 2025' },
    { id: 2, fakultas: 'Fakultas Kedokteran', nama: 'Kedokteran', kode: '2018172', dibuat: 'Selasa, 21 Januari 2025' },
    { id: 3, fakultas: 'Fakultas Sains dan Teknologi', nama: 'Matematika', kode: '2018170', dibuat: 'Senin, 03 Januari 2025' },
    { id: 4, fakultas: 'Fakultas Ekonomi dan Bisnis', nama: 'Manajemen', kode: '2018165', dibuat: 'Kamis, 09 Januari 2025' },
    { id: 5, fakultas: 'Fakultas Ilmu Sosial dan Ilmu Politik', nama: 'Hubungan Internasional', kode: '2018159', dibuat: 'Jumat, 10 Januari 2025' },
  ]);

  const openEditModal = (prodi: any) => {
    setSelectedProdi(prodi);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProdi({ fakultas: '', nama: '', kode: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSelectedProdi((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewProdiChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProdi((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNewProdi = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newId = prodiList.length + 1;
    const newCreatedDate = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
    setProdiList([...prodiList, { ...newProdi, id: newId, dibuat: newCreatedDate }]);
    setNewProdi({ fakultas: '', nama: '', kode: '' });
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedList = prodiList.map((p) =>
      p.kode === selectedProdi.kode ? { ...p, ...selectedProdi } : p
    );
    setProdiList(updatedList);
    closeEditModal();
  };

  return (
    <section className="section">
      <div className="section-header">
        <h1>Master</h1>
        <div className="section-header-breadcrumb">
          <div className="breadcrumb-item">Master</div>
          <div className="breadcrumb-item"><a href="/admin/prodi">Program Studi</a></div>
        </div>
      </div>

      <div className="section-body">
        <h2 className="section-title">Program Studi</h2>
        <p className="section-lead">
          Menampilkan semua data Program Studi yang ada pada universitas ini
        </p>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <button className="btn btn-primary btn-sm mb-2" type="button" data-toggle="collapse" data-target="#collapseTambahProdi">
                  Tambah Prodi
                </button>
                <div className="collapse" id="collapseTambahProdi">
                  <div className="card card-body">
                    <form onSubmit={handleAddNewProdi}>
                      <div className="form-group">
                        <label htmlFor="fakultas">Nama Fakultas</label>
                        <select
                          className="form-control"
                          id="fakultas"
                          name="fakultas"
                          value={newProdi.fakultas}
                          onChange={handleNewProdiChange}
                          required
                        >
                          <option value="">-- Pilih Fakultas --</option>
                          <option value="Fakultas Keguruan dan Ilmu Pendidikan">Fakultas Keguruan dan Ilmu Pendidikan</option>
                          <option value="Fakultas Ekonomi dan Bisnis">Fakultas Ekonomi dan Bisnis</option>
                          <option value="Fakultas Hukum">Fakultas Hukum</option>
                          <option value="Fakultas Ilmu Komputer">Fakultas Ilmu Komputer</option>
                          <option value="Fakultas Kedokteran">Fakultas Kedokteran</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Nama Prodi</label>
                        <input
                          type="text"
                          name="nama"
                          className="form-control"
                          placeholder="Nama Prodi"
                          value={newProdi.nama}
                          onChange={handleNewProdiChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Kode</label>
                        <input
                          type="text"
                          name="kode"
                          className="form-control"
                          placeholder="Kode"
                          value={newProdi.kode}
                          onChange={handleNewProdiChange}
                          required
                        />
                      </div>
                      <button type="submit" className="btn btn-primary">Simpan</button>
                    </form>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-striped" id="table-1">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Fakultas</th>
                        <th>Nama</th>
                        <th>Kode</th>
                        <th>Dibuat pada</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prodiList.map((prodi, index) => (
                        <tr key={prodi.id}>
                          <td>{index + 1}</td>
                          <td>{prodi.fakultas}</td>
                          <td>{prodi.nama}</td>
                          <td>{prodi.kode}</td>
                          <td>{prodi.dibuat}</td>
                          <td>
                            <a href="#" className="btn btn-icon btn-primary" onClick={(e) => { e.preventDefault(); openEditModal(prodi); }}>
                              <i className="far fa-edit"></i>
                            </a>
                            <a href="#" className="btn btn-icon btn-danger">
                              <i className="fa fa-trash"></i>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSave}>
                <div className="modal-header">
                  <h5 className="modal-title">Edit Program Studi</h5>
                  <button type="button" className="close" onClick={closeEditModal}>
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Nama Fakultas</label>
                    <select
                      name="fakultas"
                      className="form-control"
                      value={selectedProdi.fakultas}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">-- Pilih Fakultas --</option>
                      <option value="Fakultas Keguruan dan Ilmu Pendidikan">Fakultas Keguruan dan Ilmu Pendidikan</option>
                      <option value="Fakultas Ekonomi dan Bisnis">Fakultas Ekonomi dan Bisnis</option>
                      <option value="Fakultas Hukum">Fakultas Hukum</option>
                      <option value="Fakultas Ilmu Komputer">Fakultas Ilmu Komputer</option>
                      <option value="Fakultas Kedokteran">Fakultas Kedokteran</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Nama Prodi</label>
                    <input
                      type="text"
                      name="nama"
                      className="form-control"
                      value={selectedProdi.nama}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Kode</label>
                    <input
                      type="text"
                      name="kode"
                      className="form-control"
                      value={selectedProdi.kode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeEditModal}>Batal</button>
                  <button type="submit" className="btn btn-primary">Simpan</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProdiPage;
