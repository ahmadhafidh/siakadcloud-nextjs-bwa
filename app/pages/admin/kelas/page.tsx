'use client';
import React, { useState } from 'react';

type Kelas = {
  id: number;
  fakultas: string;
  prodi: string;
  tahunAjaran: string;
  namaKelas: string;
  dibuat: string;
};

const initialData: Kelas[] = [
  {
    id: 1,
    fakultas: 'Fakultas Teknik',
    prodi: 'Teknik Komputer',
    tahunAjaran: '2025/2026',
    namaKelas: 'IF-1A',
    dibuat: 'Rabu, 12 Januari 2025',
  },
  {
    id: 2,
    fakultas: 'Fakultas Ekonomi',
    prodi: 'Ekonomi',
    tahunAjaran: '2025/2026',
    namaKelas: 'IF-2A',
    dibuat: 'Rabu, 18 Januari 2025',
  },
  {
    id: 3,
    fakultas: 'Fakultas Kedokteran',
    prodi: 'Kedokteran',
    tahunAjaran: '2025/2026',
    namaKelas: 'IF-3A',
    dibuat: 'Senin, 10 Maret 2025',
  },
];

const KelasPage = () => {
  const [kelasList, setKelasList] = useState<Kelas[]>(initialData);
  const [selectedKelas, setSelectedKelas] = useState<Kelas | null>(null);

  const handleEditClick = (kelas: Kelas) => {
    setSelectedKelas(kelas);
    const modal = new (window as any).bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!selectedKelas) return;
    setSelectedKelas({
      ...selectedKelas,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    if (!selectedKelas) return;
    setKelasList(prev =>
      prev.map(k => (k.id === selectedKelas.id ? selectedKelas : k))
    );
    const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('editModal'));
    modal.hide();
  };

  return (
    <section className="section">
      <div className="section-header">
        <h1>Master</h1>
        <div className="section-header-breadcrumb">
          <div className="breadcrumb-item">Master</div>
          <div className="breadcrumb-item">
            <a href="../master/kelas.html">Kelas</a>
          </div>
        </div>
      </div>

      <div className="section-body">
        <h2 className="section-title">Kelas</h2>
        <p className="section-lead">Menampilkan semua data Kelas yang ada pada universitas ini</p>

        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <button
                  className="btn btn-primary btn-sm mb-2"
                  type="button"
                  data-toggle="collapse"
                  data-target="#collapseEditKelas"
                >
                  Tambah Kelas
                </button>
                <div className="collapse" id="collapseEditKelas">
                  <div className="card card-body">
                    <form>
                      <div className="form-group">
                        <label>Nama Fakultas</label>
                        <select className="form-control" required>
                          <option>-- Pilih Fakultas --</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Nama Program Studi</label>
                        <select className="form-control" required>
                          <option>-- Pilih Program Studi --</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Tahun Ajaran</label>
                        <input type="text" className="form-control" placeholder="Tahun Ajaran" />
                      </div>
                      <div className="form-group">
                        <label>Nama Kelas</label>
                        <input type="text" className="form-control" placeholder="Nama Kelas" />
                      </div>
                      <button type="submit" className="btn btn-primary">Simpan</button>
                    </form>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Fakultas</th>
                        <th>Program Studi</th>
                        <th>Tahun Ajaran</th>
                        <th>Nama</th>
                        <th>Dibuat Pada</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {kelasList.map((kelas, index) => (
                        <tr key={kelas.id}>
                          <td>{index + 1}</td>
                          <td>{kelas.fakultas}</td>
                          <td>{kelas.prodi}</td>
                          <td>{kelas.tahunAjaran}</td>
                          <td>{kelas.namaKelas}</td>
                          <td>{kelas.dibuat}</td>
                          <td>
                            <a href="/admin/pilihkelas" className="btn btn-icon btn-warning">
                              <i className="fa fa-users"></i>
                            </a>
                            <button
                              onClick={() => handleEditClick(kelas)}
                              className="btn btn-icon btn-primary mx-1"
                            >
                              <i className="far fa-edit"></i>
                            </button>
                            <a href="#" className="btn btn-icon btn-danger">
                              <i className="fa fa-trash"></i>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Modal Edit */}
                <div
                  className="modal fade"
                  id="editModal"
                  tabIndex={-1}
                  aria-labelledby="editModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="editModalLabel">Edit Kelas</h5>
                        <button
                          type="button"
                          className="close"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      {selectedKelas && (
                        <div className="modal-body">
                          <div className="form-group">
                            <label>Nama Fakultas</label>
                            <select
                              className="form-control"
                              name="fakultas"
                              value={selectedKelas.fakultas}
                              onChange={handleChange}
                            >
                              <option value="fkip">Fakultas Keguruan dan Ilmu Pendidikan</option>
                              <option value="feb">Fakultas Ekonomi dan Bisnis</option>
                              <option value="fh">Fakultas Hukum</option>
                              <option value="fik">Fakultas Ilmu Komputer</option>
                              <option value="fk">Fakultas Kedokteran</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label>Program Studi</label>
                            <input
                              className="form-control"
                              name="prodi"
                              value={selectedKelas.prodi}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="form-group">
                            <label>Tahun Ajaran</label>
                            <input
                              className="form-control"
                              name="tahunAjaran"
                              value={selectedKelas.tahunAjaran}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="form-group">
                            <label>Nama Kelas</label>
                            <input
                              className="form-control"
                              name="namaKelas"
                              value={selectedKelas.namaKelas}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      )}
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">
                          Tutup
                        </button>
                        <button onClick={handleSave} className="btn btn-primary">
                          Simpan Perubahan
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End Modal */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KelasPage;
