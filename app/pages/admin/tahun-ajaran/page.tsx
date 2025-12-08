'use client';

import React, { useState } from 'react';

interface TahunAjaran {
  id: number;
  nama: string;
  tanggalMulai: string;
  tanggalBerakhir: string;
  isAktif: boolean;
  createdAt: string;
}

const TahunAjaranPage = () => {
  const [data, setData] = useState<TahunAjaran[]>([
    {
      id: 1,
      nama: '2025/2026',
      tanggalMulai: 'Senin, 06 Januari 2025',
      tanggalBerakhir: 'Senin, 30 Juni 2025',
      isAktif: true,
      createdAt: 'Rabu, 15 Januari 2025',
    },
  ]);

  const [selectedEdit, setSelectedEdit] = useState<TahunAjaran | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEdit = (item: TahunAjaran) => {
    setSelectedEdit(item);
    setShowEditModal(true);
  };

  return (
    <section className="section">
      <div className="section-header">
        <h1>Master</h1>
        <div className="section-header-breadcrumb">
          <div className="breadcrumb-item">Master</div>
          <div className="breadcrumb-item">
            <a href="../master/tahun-ajaran.html">Tahun Ajaran</a>
          </div>
        </div>
      </div>

      <div className="section-body">
        <h2 className="section-title">Tahun Ajaran</h2>
        <p className="section-lead">
          Menampilkan semua data Tahun Ajaran yang ada pada universitas ini
        </p>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <button
                  className="btn btn-primary btn-sm footer-left mb-2"
                  type="button"
                  data-toggle="collapse"
                  data-target="#collapseTambahTahunAjaran"
                >
                  Tambah Tahun Ajaran
                </button>

                <div className="collapse" id="collapseTambahTahunAjaran">
                  <div className="card card-body">
                    <form>
                      <div className="form-group">
                        <label>Nama Tahun Ajaran</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Nama Tahun Ajaran"
                        />
                      </div>
                      <div className="form-group">
                        <label>Tanggal Dimulai</label>
                        <input
                          type="date"
                          className="form-control"
                          name="tanggal_mulai"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Tanggal Berakhir</label>
                        <input
                          type="date"
                          className="form-control"
                          name="tanggal_berakhir"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Apakah Aktif</label>
                        <br />
                        <div className="custom-control custom-switch">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            id="isAktif"
                            name="is_aktif"
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="isAktif"
                          >
                            Aktif
                          </label>
                        </div>
                      </div>
                      <button type="submit" className="btn btn-primary">
                        Simpan
                      </button>
                    </form>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-striped" id="table-1">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Nama</th>
                        <th>Tanggal Dimulai</th>
                        <th>Tanggal Berakhir</th>
                        <th>Aktif</th>
                        <th>Dibuat pada</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item, index) => (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td>{item.nama}</td>
                          <td>{item.tanggalMulai}</td>
                          <td>{item.tanggalBerakhir}</td>
                          <td>
                            <span className={`badge ${item.isAktif ? 'badge-success' : 'badge-secondary'}`}>
                              {item.isAktif ? 'Aktif' : 'Tidak'}
                            </span>
                          </td>
                          <td>{item.createdAt}</td>
                          <td>
                            <button
                              onClick={() => handleEdit(item)}
                              className="btn btn-icon btn-primary"
                            >
                              <i className="far fa-edit"></i>
                            </button>
                            <button className="btn btn-icon btn-danger">
                              <i className="fa fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Modal Edit */}
                {showEditModal && selectedEdit && (
                  <div
                    className="modal fade show d-block"
                    tabIndex={-1}
                    role="dialog"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                  >
                    <div
                      className="modal-dialog modal-dialog-centered"
                      role="document"
                    >
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">Edit Tahun Ajaran</h5>
                          <button
                            type="button"
                            className="close"
                            onClick={() => setShowEditModal(false)}
                          >
                            <span>&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          <form>
                            <div className="form-group">
                              <label>Nama Tahun Ajaran</label>
                              <input
                                type="text"
                                className="form-control"
                                defaultValue={selectedEdit.nama}
                              />
                            </div>
                            <div className="form-group">
                              <label>Tanggal Dimulai</label>
                              <input
                                type="date"
                                className="form-control"
                                defaultValue={selectedEdit.tanggalMulai}
                              />
                            </div>
                            <div className="form-group">
                              <label>Tanggal Berakhir</label>
                              <input
                                type="date"
                                className="form-control"
                                defaultValue={selectedEdit.tanggalBerakhir}
                              />
                            </div>
                            <div className="form-group">
                              <label>Status Aktif</label>
                              <br />
                              <div className="custom-control custom-switch">
                                <input
                                  type="checkbox"
                                  className="custom-control-input"
                                  id="editIsAktif"
                                  defaultChecked={selectedEdit.isAktif}
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="editIsAktif"
                                >
                                  Aktif
                                </label>
                              </div>
                            </div>
                          </form>
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setShowEditModal(false)}
                          >
                            Batal
                          </button>
                          <button type="submit" className="btn btn-primary">
                            Simpan Perubahan
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* End Modal */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TahunAjaranPage;
