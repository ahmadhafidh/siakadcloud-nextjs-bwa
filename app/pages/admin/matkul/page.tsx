
import React from 'react';
import MyBarChart from '../../../components/myBarChart';

const MatkulPage = () => {
  return (
    <section className="section">
      <div className="section-header">
        <h1>Akademik</h1>
        <div className="section-header-breadcrumb">
          <div className="breadcrumb-item">Akademik</div>
          <div className="breadcrumb-item">
            <a href="/admin/akademik/matkul">Mata Kuliah</a>
          </div>
        </div>
      </div>

      <div className="section-body">
        <h2 className="section-title">Mata Kuliah</h2>
        <p className="section-lead">Menampilkan semua data Mata Kuliah yang ada pada universitas ini</p>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <button
                  className="btn btn-primary btn-sm footer-left mb-2"
                  type="button"
                  data-toggle="collapse"
                  data-target="#collapseEditMatkul"
                >
                  Tambah Mata Kuliah
                </button>
                <div className="collapse" id="collapseEditMatkul">
                  <div className="card card-body">
                    <form>
                      <div className="form-group">
                        <label htmlFor="fakultas">Nama Fakultas</label>
                        <select className="form-control" id="fakultas" name="fakultas" required>
                          <option value="">-- Pilih Fakultas --</option>
                          <option value="fkip">Fakultas Keguruan dan Ilmu Pendidikan</option>
                          <option value="feb">Fakultas Ekonomi dan Bisnis</option>
                          <option value="fh">Fakultas Hukum</option>
                          <option value="fik">Fakultas Ilmu Komputer</option>
                          <option value="fk">Fakultas Kedokteran</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="prodi">Nama Program Studi</label>
                        <select className="form-control" id="prodi" name="prodi" required>
                          <option value="">-- Pilih Program Studi --</option>
                          <option value="ti">Teknik Informatika</option>
                          <option value="ekonomi">Ekonomi</option>
                          <option value="hukum">Hukum</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Dosen</label>
                        <input type="text" className="form-control" placeholder="Dosen" />
                      </div>
                      <div className="form-group">
                        <label>Kode Mata Kuliah</label>
                        <input type="text" className="form-control" placeholder="Kode Mata Kuliah" />
                      </div>
                      <div className="form-group">
                        <label>Nama Mata Kuliah</label>
                        <input type="text" className="form-control" placeholder="Nama Mata Kuliah" />
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
                        <th>Fakultas</th>
                        <th>Program Studi</th>
                        <th>Dosen</th>
                        <th>Kode Mata Kuliah</th>
                        <th>Nama</th>
                        <th>Dibuat Pada</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>Fakultas Teknik</td>
                        <td>Teknik Informatika</td>
                        <td>Prof. Irfan Suryana</td>
                        <td>IF101</td>
                        <td>Pemrograman Dasar</td>
                        <td>2023-08-15</td>
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
                        <td>Dr. Rina Widya</td>
                        <td>MN204</td>
                        <td>Manajemen Pemasaran</td>
                        <td>2023-09-10</td>
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
                        <td>Dr. Siti Rohmah</td>
                        <td>HK301</td>
                        <td>Hukum Perdata</td>
                        <td>2024-01-05</td>
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
                        <td>Ir. Budi Santosa, M.T</td>
                        <td>TS120</td>
                        <td>Mekanika Struktur</td>
                        <td>2023-11-20</td>
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
                        <td>Dr. Andika Prasetyo</td>
                        <td>SO210</td>
                        <td>Sosiologi Keluarga</td>
                        <td>2023-12-18</td>
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

export default MatkulPage;
