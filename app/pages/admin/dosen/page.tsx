
import React from 'react';

const DosenPage = () => {
  return (
    <section className="section">
      <div className="section-header">
        <h1>Pengguna</h1>
        <div className="section-header-breadcrumb">
          <div className="breadcrumb-item">Pengguna</div>
          <div className="breadcrumb-item">
            <a href="../pengguna/dosen.html">Dosen</a>
          </div>
        </div>
      </div>

      <div className="section-body">
        <h2 className="section-title">Dosen</h2>
        <p className="section-lead">
          Menampilkan semua data Dosen yang ada pada universitas ini
        </p>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <button
                  className="btn btn-primary btn-sm footer-left mb-2"
                  type="button"
                  data-toggle="collapse"
                  data-target="#collapseEditDosen"
                >
                  Tambah Dosen
                </button>
                <div className="collapse" id="collapseEditDosen">
                  <div className="card card-body">
                    <form action="#" method="POST">
                      <div className="row">
                        <div className="form-group col-md-6">
                          <label>Nama</label>
                          <input type="text" className="form-control" name="nama" />
                        </div>
                        <div className="form-group col-md-6">
                          <label>Email</label>
                          <input type="email" className="form-control" name="email" />
                        </div>
                        <div className="form-group col-md-6">
                          <label>Fakultas</label>
                          <select className="form-control" name="fakultas">
                            <option></option>
                            <option>Fakultas Teknik</option>
                            <option>Fakultas Ekonomi</option>
                            <option>Fakultas Hukum</option>
                          </select>
                        </div>
                        <div className="form-group col-md-6">
                          <label>Program Studi</label>
                          <input type="text" className="form-control" name="prodi" />
                        </div>
                        <div className="form-group col-md-6">
                          <label>NIP</label>
                          <input type="text" className="form-control" name="nip" />
                        </div>
                        <div className="form-group col-md-3">
                          <label>Jabatan</label>
                          <input type="text" className="form-control" name="jabatan" />
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
                        <th>NIP</th>
                        <th>Jabatan</th>
                        <th>Dibuat pada</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Data dummy, bisa diganti dengan map dari state/props */}
                      {[
                        {
                          id: 1,
                          nama: "Dr. Rina Widya",
                          email: "rina.widya@univ.ac.id",
                          fakultas: "Fakultas Ekonomi",
                          prodi: "Manajemen",
                          nip: "197812132005042001",
                          jabatan: "Kaprodi",
                          tanggal: "2023-09-15",
                        },
                        {
                          id: 2,
                          nama: "Prof. Irfan Suryana",
                          email: "irfan.s@univ.ac.id",
                          fakultas: "Fakultas Teknik",
                          prodi: "Teknik Informatika",
                          nip: "196905051990031002",
                          jabatan: "Dekan",
                          tanggal: "2022-11-02",
                        },
                        {
                          id: 3,
                          nama: "Dr. Siti Rohmah",
                          email: "siti.rohmah@univ.ac.id",
                          fakultas: "Fakultas Hukum",
                          prodi: "Ilmu Hukum",
                          nip: "198201162008122001",
                          jabatan: "Dosen Tetap",
                          tanggal: "2024-01-10",
                        },
                        {
                          id: 4,
                          nama: "Ir. Budi Santosa, M.T",
                          email: "budi.santosa@univ.ac.id",
                          fakultas: "Fakultas Teknik",
                          prodi: "Teknik Sipil",
                          nip: "197003201994041001",
                          jabatan: "Ketua Laboratorium",
                          tanggal: "2023-06-05",
                        },
                        {
                          id: 5,
                          nama: "Dr. Andika Prasetyo",
                          email: "andika.p@univ.ac.id",
                          fakultas: "Fakultas Ilmu Sosial",
                          prodi: "Sosiologi",
                          nip: "198907152014051002",
                          jabatan: "Sekretaris Prodi",
                          tanggal: "2023-12-22",
                        },
                      ].map((dosen) => (
                        <tr key={dosen.id}>
                          <td>{dosen.id}</td>
                          <td>{dosen.nama}</td>
                          <td>{dosen.email}</td>
                          <td>{dosen.fakultas}</td>
                          <td>{dosen.prodi}</td>
                          <td>{dosen.nip}</td>
                          <td>{dosen.jabatan}</td>
                          <td>{dosen.tanggal}</td>
                          <td>
                            <a href="#" className="btn btn-icon btn-primary">
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
    </section>
  );
};

export default DosenPage;
