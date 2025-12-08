'use client';
import React, { useState } from 'react';

const FakultasPage = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFakultas, setSelectedFakultas] = useState({
    nama: '',
    kode: '',
  });

  const fakultasList = [
    { id: 1, nama: 'Fakultas Teknik', kode: 'FT001',  dibuat: '10 Januari 2025' },
    { id: 2, nama: 'Fakultas Kedokteran', kode: 'FK002', dibuat: '11 Januari 2025' },
    { id: 3, nama: 'Fakultas Hukum', kode: 'FH003', dibuat: '12 Januari 2025' },
  ];

  const openEditModal = (fakultas: typeof selectedFakultas) => {
    setSelectedFakultas(fakultas);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedFakultas({ nama: '', kode: ''});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedFakultas((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Saved fakultas:', selectedFakultas);
    closeEditModal();
  };

  return (
    <section className="section">
      <div className="section-header">
        <h1>Master</h1>
        <div className="section-header-breadcrumb">
          <div className="breadcrumb-item">Master</div>
          <div className="breadcrumb-item"><a href="#">Fakultas</a></div>
        </div>
      </div>

      <div className="section-body">
        <h2 className="section-title">Fakultas</h2>
        <p className="section-lead">Menampilkan semua data fakultas yang ada pada universitas ini</p>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <button
                  className="btn btn-primary btn-sm footer-left mb-2"
                  type="button"
                  data-toggle="collapse"
                  data-target="#collapseTambahFakultas"
                >
                  Tambah Fakultas
                </button>
                <div className="collapse" id="collapseTambahFakultas">
                  <div className="card card-body">
                    <form>
                      <div className="form-group">
                        <label>Nama Fakultas</label>
                        <input type="text" className="form-control" placeholder="Nama Fakultas" />
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
                        <th>Nama</th>
                        <th>Kode</th>
                        <th>Dibuat pada</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fakultasList.map((fakultas, index) => (
                        <tr key={fakultas.id}>
                          <td>{index + 1}</td>
                          <td>{fakultas.nama}</td>
                          <td>{fakultas.kode}</td>
                          <td>{fakultas.dibuat}</td>
                          <td>
                            <a
                              href="#"
                              className="btn btn-icon btn-primary"
                              onClick={(e) => {
                                e.preventDefault();
                                openEditModal(fakultas);
                              }}
                            >
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

                {/* Modal */}
                {isEditModalOpen && (
                  <div className="modal fade show" style={{
                    display: 'block',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1050,
                  }}>
                    <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content">
                        <form onSubmit={handleSave}>
                          <div className="modal-header">
                            <h5 className="modal-title">Edit Fakultas</h5>
                            <button type="button" className="close" onClick={closeEditModal}>
                              <span>&times;</span>
                            </button>
                          </div>
                          <div className="modal-body">
                            <div className="form-group">
                              <label>Nama Fakultas</label>
                              <input
                                type="text"
                                className="form-control"
                                name="nama"
                                value={selectedFakultas.nama}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                          </div>
                          <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={closeEditModal}>
                              Batal
                            </button>
                            <button type="submit" className="btn btn-primary">
                              Simpan
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FakultasPage;
