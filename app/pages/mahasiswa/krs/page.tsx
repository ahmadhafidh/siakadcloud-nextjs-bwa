import React from 'react';

const MahasiswaKRS = () => {
  return (
    <section className="section">
      <div className="section-header">
        <h1>Kartu Rencana Studi</h1>
      </div>

      <div className="section-body">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <button
                  className="btn btn-primary btn-sm footer-left mb-2"
                  type="button"
                  data-toggle="collapse"
                  data-target="#collapseTambahKRS"
                >
                  Tambah Kartu Rencana Studi
                </button>

                <div className="collapse" id="collapseTambahKRS">
                  <div className="card card-body">
                    <form>
                      <div className="row">
                        <div className="form-group col-md-6">
                          <label>Nama Mahasiswa</label>
                          <input
                            type="text"
                            className="form-control"
                            value="Ujang Maman"
                            readOnly
                          />
                        </div>
                        <div className="form-group col-md-3">
                          <label>NIM</label>
                          <input
                            type="text"
                            className="form-control"
                            value="1234567890"
                            readOnly
                          />
                        </div>
                        <div className="form-group col-md-3">
                          <label>Tahun Ajaran</label>
                          <select className="form-control" defaultValue="2025/2026">
                            <option>2023/2024</option>
                            <option>2024/2025</option>
                            <option>2025/2026</option>
                          </select>
                        </div>
                      </div>

                      <div className="table-responsive mt-4">
                        <table className="table table-bordered">
                          <thead className="thead-light">
                            <tr>
                              <th style={{ width: '5%' }}>Pilih</th>
                              <th>Kode MK</th>
                              <th>Nama Mata Kuliah</th>
                              <th>SKS</th>
                              <th>Dosen Pengampu</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <input type="checkbox" name="matkul[]" value="IF201" />
                              </td>
                              <td>IF201</td>
                              <td>Pemrograman Web</td>
                              <td>3</td>
                              <td>Dr. Indra Kusuma</td>
                            </tr>
                            <tr>
                              <td>
                                <input type="checkbox" name="matkul[]" value="IF202" />
                              </td>
                              <td>IF202</td>
                              <td>Struktur Data</td>
                              <td>3</td>
                              <td>Prof. Dian Astuti</td>
                            </tr>
                            <tr>
                              <td>
                                <input type="checkbox" name="matkul[]" value="IF203" />
                              </td>
                              <td>IF203</td>
                              <td>Sistem Operasi</td>
                              <td>3</td>
                              <td>Dr. Rudi Hartono</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="form-group mt-3">
                        <button type="submit" className="btn btn-primary">
                          Simpan KRS
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
                        <th>Tahun Ajaran</th>
                        <th>Status</th>
                        <th>Dibuat pada</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>2025/2026</td>
                        <td>
                          <span className="badge badge-success">Disetujui</span>
                        </td>
                        <td>2024-08-01</td>
                        <td>
                          <a href="#" className="btn btn-icon btn-primary" id="modal-1">
                            <i className="fa fa-eye"></i>
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
    </section>
  );
};

export default MahasiswaKRS;
