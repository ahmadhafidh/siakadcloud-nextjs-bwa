
import React from 'react';
import MyBarChart from '../../../components/myBarChart';

const UKTPage = () => {
  return (
    <section className="section">
      <div className="section-header">
        <h1>Pembayaran</h1>
        <div className="section-header-breadcrumb">
          <div className="breadcrumb-item">Pembayaran</div>
          <div className="breadcrumb-item"><a href="../pembayaran/ukt.html">Uang Kuliah Tunggal</a></div>
        </div>
      </div>

      <div className="section-body">
        <h2 className="section-title">UKT</h2>
        <p className="section-lead">
          Menampilkan semua data UKT yang ada pada universitas ini
        </p>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <button className="btn btn-primary btn-sm footer-left mb-2" type="button" data-toggle="collapse" data-target="#collapseEditUKT">
                  Tambah UKT
                </button>
                <div className="collapse" id="collapseEditUKT">
                  <div className="card card-body">
                    <form>
                      <div className="form-group">
                        <label htmlFor="nama">Nama</label>
                        <select className="form-control" id="nama" name="nama" required>
                            <option value="">-- Pilih Mahasiswa --</option>
                            <option value="gilang">Gilang</option>
                            <option value="salis">Salis</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Status</label>
                        <input type="text" className="form-control" placeholder="Status" />
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
                        <th>Program Studi</th>
                        <th>Nama</th>
                        <th>NIM</th>
                        <th>Semester</th>
                        <th>Status</th>
                        <th>Dibuat pada</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>Fakultas Teknik</td>
                        <td>Teknik Informatika</td>
                        <td>Agus Pratama</td>
                        <td>2021001</td>
                        <td>4</td>
                        <td>Aktif</td>
                        <td>2024-08-01</td>
                        <td>
                          <a href="#" className="btn btn-icon btn-primary">
                            <i className="far fa-edit"></i>
                          </a>
                          <a href="#" className="btn btn-icon btn-danger">
                            <i className="fa fa-trash"></i>
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>Fakultas Ekonomi</td>
                        <td>Manajemen</td>
                        <td>Andini Anjani</td>
                        <td>2021002</td>
                        <td>6</td>
                        <td>Aktif</td>
                        <td>2024-08-01</td>
                        <td>
                          <a href="#" className="btn btn-icon btn-primary">
                            <i className="far fa-edit"></i>
                          </a>
                          <a href="#" className="btn btn-icon btn-danger">
                            <i className="fa fa-trash"></i>
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td>Fakultas Hukum</td>
                        <td>Ilmu Hukum</td>
                        <td>Citra Dewi</td>
                        <td>2021003</td>
                        <td>2</td>
                        <td>Nonaktif</td>
                        <td>2024-08-01</td>
                        <td>
                          <a href="#" className="btn btn-icon btn-primary">
                            <i className="far fa-edit"></i>
                          </a>
                          <a href="#" className="btn btn-icon btn-danger">
                            <i className="fa fa-trash"></i>
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>4</td>
                        <td>Fakultas Teknik</td>
                        <td>Teknik Sipil</td>
                        <td>Doni Hidayat</td>
                        <td>2021004</td>
                        <td>5</td>
                        <td>Aktif</td>
                        <td>2024-08-01</td>
                        <td>
                          <a href="#" className="btn btn-icon btn-primary">
                            <i className="far fa-edit"></i>
                          </a>
                          <a href="#" className="btn btn-icon btn-danger">
                            <i className="fa fa-trash"></i>
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>5</td>
                        <td>Fakultas Ilmu Sosial</td>
                        <td>Sosiologi</td>
                        <td>Eva Lestari</td>
                        <td>2021005</td>
                        <td>8</td>
                        <td>Aktif</td>
                        <td>2024-08-01</td>
                        <td>
                          <a href="#" className="btn btn-icon btn-primary">
                            <i className="far fa-edit"></i>
                          </a>
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
    </section>
  );
};

export default UKTPage;
