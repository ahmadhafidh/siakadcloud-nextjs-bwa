'use client';
import React, { useState } from 'react';

const MahasiswaPage = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const toggleEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };

  return (
    <section className="section">
      <div className="section-header">
        <h1>Pengguna</h1>
        <div className="section-header-breadcrumb">
          <div className="breadcrumb-item">Pengguna</div>
          <div className="breadcrumb-item">
            <a href="../pengguna/mahasiswa.html">Pengguna</a>
          </div>
        </div>
      </div>

      <div className="section-body">
        <h2 className="section-title">Mahasiswa</h2>
        <p className="section-lead">
          Menampilkan semua data Mahasiswa yang ada pada universitas ini
        </p>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <button
                  className="btn btn-primary btn-sm footer-left mb-2"
                  type="button"
                  data-toggle="collapse"
                  data-target="#collapseEditMahasiswa"
                >
                  Tambah Mahasiswa
                </button>
                <div className="collapse" id="collapseEditMahasiswa">
                  <div className="card card-body">
                    <form action="#" method="POST">
                      <div className="row">
                        <div className="form-group col-md-6">
                          <label>Nama</label>
                          <input
                            type="text"
                            className="form-control"
                            name="nama"
                            placeholder="Nama"
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label>Email</label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            placeholder="Email"
                          />
                        </div>
                        <select className="form-control" name="fakultas" defaultValue="Fakultas Ekonomi">
                          <option>Fakultas Teknik</option>
                          <option>Fakultas Ekonomi</option>
                          <option>Fakultas Hukum</option>
                        </select>
                        <div className="form-group col-md-6">
                          <label>Program Studi</label>
                          <input
                            type="text"
                            className="form-control"
                            name="prodi"
                            placeholder="Program Studi"
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label>Kelas</label>
                          <input
                            type="text"
                            className="form-control"
                            name="kelas"
                            placeholder="Kelas"
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label>Golongan UKT</label>
                          <select className="form-control" name="ukt" defaultValue="UKT 3">
                            <option>UKT 1</option>
                            <option>UKT 3</option>
                            <option>UKT 5</option>
                          </select>
                        </div>
                        <div className="form-group col-md-6">
                          <label>NIM</label>
                          <input
                            type="text"
                            className="form-control"
                            name="nim"
                            placeholder="Nomor Induk Mahasiswa"
                          />
                        </div>
                        <div className="form-group col-md-3">
                          <label>Semester</label>
                          <input
                            type="number"
                            className="form-control"
                            name="semester"
                            placeholder="Semester"
                          />
                        </div>
                        <div className="form-group col-md-3">
                          <label>Angkatan</label>
                          <input
                            type="number"
                            className="form-control"
                            name="angkatan"
                            placeholder="Angkatan"
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <button type="submit" className="btn btn-primary">
                          Simpan Perubahan
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-toggle="collapse"
                          data-target="#collapseEditMahasiswa"
                        >
                          Batal
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table table-striped" id="table-1">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Nama</th>
                        <th>Email</th>
                        <th>Fakultas</th>
                        <th>Program Studi</th>
                        <th>Kelas</th>
                        <th>Golongan UKT</th>
                        <th>NIM</th>
                        <th>Semester</th>
                        <th>Angkatan</th>
                        <th>Dibuat pada</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>Agus Pratama</td>
                        <td>agus.pratama@example.com</td>
                        <td>Fakultas Teknik</td>
                        <td>Informatika</td>
                        <td>TI-1A</td>
                        <td>UKT 3</td>
                        <td>2021001</td>
                        <td>6</td>
                        <td>2021</td>
                        <td>2023-07-12</td>
                        <td>
                          <button
                            className="btn btn-icon btn-primary"
                            onClick={toggleEditModal}
                          >
                            <i className="far fa-edit"></i>
                          </button>
                          <a href="#" className="btn btn-icon btn-danger">
                            <i className="fa fa-trash"></i>
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Edit */}
      {isEditModalOpen && (
        <div className="modal show" tabIndex={-1} role="dialog" aria-labelledby="editModalLabel">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="editModalLabel">Edit Mahasiswa</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={toggleEditModal}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label>Nama</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue="Agus Pratama"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      className="form-control"
                      defaultValue="agus.pratama@example.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Fakultas</label>
                    <select className="form-control">
                      <option>Fakultas Teknik</option>
                      <option>Fakultas Ekonomi</option>
                      <option>Fakultas Hukum</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Program Studi</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue="Informatika"
                    />
                  </div>
                  <div className="form-group">
                    <label>Kelas</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue="TI-1A"
                    />
                  </div>
                  <div className="form-group">
                    <label>Golongan UKT</label>
                    <select className="form-control">
                      <option>UKT 1</option>
                      <option>UKT 3</option>
                      <option>UKT 5</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>NIM</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue="2021001"
                    />
                  </div>
                  <div className="form-group">
                    <label>Semester</label>
                    <input
                      type="number"
                      className="form-control"
                      defaultValue="6"
                    />
                  </div>
                  <div className="form-group">
                    <label>Angkatan</label>
                    <input
                      type="number"
                      className="form-control"
                      defaultValue="2021"
                    />
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={toggleEditModal}>
                      Tutup
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MahasiswaPage;
