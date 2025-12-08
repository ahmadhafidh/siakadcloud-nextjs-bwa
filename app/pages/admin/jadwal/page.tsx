
import React from 'react';
import MyBarChart from '../../../components/myBarChart';

const JadwalPage = () => {
  return (
    <section className="section">
        <div className="section-header">
            <h1>Akademik</h1>
        <div className="section-header-breadcrumb">
            <div className="breadcrumb-item">Akademik</div>
                <div className="breadcrumb-item">
                    <a href="/admin/akademik/jadwal">Jadwal</a>
                </div>
            </div>
        </div>

        <div className="section-body">
            <h2 className="section-title">Jadwal</h2>
            <p className="section-lead">Menampilkan semua data Jadwal yang ada pada universitas ini</p>
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
                            Tambah Jadwal
                        </button>
                        <div className="collapse" id="collapseEditMatkul">
                            <div className="card card-body">
                            <form>
                                <div className="form-group">
                                <label htmlFor="fakultas">Kelas</label>
                                <select className="form-control" id="fakultas" name="fakultas" required>
                                    <option value="">-- Pilih Kelas --</option>
                                    <option value="A1">A1</option>
                                    <option value="A2">A2</option>
                                    <option value="A3">A3</option>
                                    <option value="A4">A4</option>
                                    <option value="A5">A5</option>
                                </select>
                                </div>
                                <div className="form-group">
                                <label htmlFor="prodi">Mata Kuliah</label>
                                <select className="form-control" id="prodi" name="prodi" required>
                                    <option value="">-- Pilih Mata Kuliah --</option>
                                    <option value="pw">Pemrograman Web</option>
                                    <option value="ad">Analisis Data</option>
                                    <option value="ai">Artificial Intelligent</option>
                                </select>
                                </div>
                                <div className="form-group">
                                <label>Tanggal dan Jam Mulai</label>
                                <input type="datetime-local" className="form-control" />
                                </div>
                                <div className="form-group">
                                <label>Tanggal dan Jam Berakhir</label>
                                <input type="datetime-local" className="form-control" />
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
                                <th>Mata Kuliah</th>
                                <th>Kelas</th>
                                <th>Dosen</th>
                                <th>Hari</th>
                                <th>Tanggal</th>
                                <th>Waktu Mulai</th>
                                <th>Waktu Berakhir</th>
                                <th>Dibuat Pada</th>
                                <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <td>1</td>
                                <td>Fakultas Teknik</td>
                                <td>Teknik Informatika</td>
                                <td>Pemrograman Dasar</td>
                                <td>TI-1A</td>
                                <td>Ahmad Hafidh</td>
                                <td>Senin</td>
                                <td>2024-07-20</td>
                                <td>08:00</td>
                                <td>10:00</td>
                                <td>2024-07-20</td>
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
                                <td>Manajemen Pemasaran</td>
                                <td>MN-2B</td>
                                <td>Ahmad Hafidh</td>
                                <td>Senin</td>
                                <td>2024-07-20</td>
                                <td>10:15</td>
                                <td>12:15</td>
                                <td>2024-07-22</td>
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
                                <td>Hukum Perdata</td>
                                <td>HK-3C</td>
                                <td>Ahmad Hafidh</td>
                                <td>Senin</td>
                                <td>2024-07-20</td>
                                <td>13:00</td>
                                <td>15:00</td>
                                <td>2024-07-25</td>
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
                                <td>Mekanika Struktur</td>
                                <td>TS-4A</td>
                                <td>Ahmad Hafidh</td>
                                <td>Senin</td>
                                <td>2024-07-20</td>
                                <td>07:30</td>
                                <td>09:30</td>
                                <td>2024-07-30</td>
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
                                <td>Sosiologi Keluarga</td>
                                <td>SO-5B</td>
                                <td>Ahmad Hafidh</td>
                                <td>Senin</td>
                                <td>2024-07-20</td>
                                <td>14:00</td>
                                <td>16:00</td>
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

export default JadwalPage;