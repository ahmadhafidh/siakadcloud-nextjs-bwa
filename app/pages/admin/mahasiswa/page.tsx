'use client';
import React, { useState, useEffect } from 'react';
import api from "@/app/lib/axiosInstance";

interface Mahasiswa {
  id: string;
  name: string;
  email: string;
  studentNumber: string;
  semester: number;
  classOf: number;
  tfGroupId: string;
  tfGroup?: GolUkt;
  classId: string;
  class?: Kelas;
  createdAt: string;
}

interface Fakultas {
  id: string;
  name: string;
}

interface Prodi {
  id: string;
  name: string;
  faculty: Fakultas;
}

interface GolUkt {
  id: string;
  group: string;
}

interface Kelas {
  id: string;
  name: string;
  major: Prodi;
}

//API services
const getGolUkt = async () => {
  const res = await api.get("/tf-groups");
  return res.data.data;
};
const getKelas = async () => {
  const res = await api.get("/classes");
  return res.data.data;
};
const getMahasiswa = async () => {
  const res = await api.get("/students");
  return res.data.data;
};
const addMahasiswa = async (data: {
  name: string;
  email: string;
  semester: number;
  classOf: number;
  tfGroupId: string;
  classId: string;
}) => {
  const res = await api.post("/students", data);
  return res.data;
};
const updateMahasiswa = async (
  id: string,
  data: {
    name: string;
    email: string;
    semester: number;
    classOf: number;
    tfGroupId: string;
    classId: string;
  }
) => {
  const res = await api.put(`/students/${id}`, data);
  return res.data;
};
const deleteMahasiswa = async (id: string) => {
  const res = await api.delete(`/students/${id}`);
  return res.data;
};


const MahasiswaPage = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState<
    Partial<Mahasiswa>
  >({});
  const [newMahasiswa, setNewMahasiswa] = useState({
    name: "",
    email: "",
    semester: 0,
    classOf: 0,
    tfGroupId: "",
    classId: "",
  });
  const [mahasiswaList, setMahasiswaList] = useState<Mahasiswa[]>([]);
  const [golUktList, setGolUktList] = useState<GolUkt[]>([]);
  const [kelasList, setKelasList] = useState<Kelas[]>([]);

  // ambil data awal
  useEffect(() => {
    fetchGolUkt();
    fetchKelas();
    fetchMahasiswa();
  }, []);

  const fetchGolUkt = async () => {
    try {
      const data = await getGolUkt();
      setGolUktList(data);
    } catch (err) {
      console.error("Gagal fetch prodi:", err);
    }
  };

  const fetchKelas = async () => {
    try {
      const data = await getKelas();
      setKelasList(data);
    } catch (err) {
      console.error("Gagal fetch tahun ajaran:", err);
    }
  };

  const fetchMahasiswa = async () => {
    try {
      const data = await getMahasiswa();
      setMahasiswaList(data);
    } catch (err) {
      console.error("Gagal fetch mahasiswa:", err);
    }
  };

  const handleNewMahasiswaChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewMahasiswa((prev) => ({ ...prev, [name]: value }));
  };

  //create data
  const handleAddNewMahasiswa = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const saved = await addMahasiswa(newMahasiswa);
      setMahasiswaList((prev) => [...prev, saved]);
      setNewMahasiswa({
        name: "",
        email: "",
        semester: 0,
        classOf: 0,
        tfGroupId: "",
        classId: "",
      });
      fetchMahasiswa();
    } catch (err) {
      console.error("Gagal tambah mahasiswa:", err);
    }
  };

  const openEditModal = (mahasiswa: Mahasiswa) => {
    setSelectedMahasiswa(mahasiswa);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedMahasiswa({});
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSelectedMahasiswa((prev) => ({ ...prev, [name]: value }));
  };

  // update data
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedMahasiswa.id) return;

    try {
      const updated = await updateMahasiswa(selectedMahasiswa.id, {
        name: selectedMahasiswa.name ?? "",
        email: selectedMahasiswa.email ?? "",
        semester: selectedMahasiswa.semester ?? 0,
        classOf: selectedMahasiswa.classOf ?? 0,
        tfGroupId: selectedMahasiswa.tfGroupId ?? "",
        classId: selectedMahasiswa.classId ?? "",
      });

      setMahasiswaList((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      closeEditModal();
      fetchMahasiswa();
    } catch (err) {
      console.error("Gagal update mahasiswa:", err);
    }
  };

  // delete data
  const handleDelete = async (id: string) => {
    if (!confirm("yakin hapus data ini")) return

    try {
      await deleteMahasiswa(id)
      setMahasiswaList((prev) => prev.filter((p) => p.id !== id))
      alert("data berhasil dihapus!");
    } catch (err: any) {
      // Cek apakah error karena foreign key constraint
      if (err.response?.data?.data?.error?.includes("Foreign key constraint")) {
        alert(
          "data tidak bisa dihapus karena masih ada data yang berelasi ditable lain"
        );
      } else {
        alert("Gagal hapus data: " + err.message);
      }
      console.error("Gagal hapus data:", err);
    }
  }

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
                    <form
                      action="#"
                      onSubmit={handleAddNewMahasiswa}
                      method="POST"
                    >
                      <div className="row">
                        <div className="form-group col-md-6">
                          <label>Nama</label>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            placeholder="Nama"
                            value={newMahasiswa.name} // pakai newProdi
                            onChange={handleNewMahasiswaChange}
                            required
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label>Email</label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            placeholder="Email"
                            value={newMahasiswa.email} // pakai newProdi
                            onChange={handleNewMahasiswaChange}
                            required
                          />
                        </div>
                        <div className="form-group col-md-3">
                          <label>Semester</label>
                          <input
                            type="number"
                            className="form-control"
                            name="semester"
                            placeholder="Semester"
                            value={newMahasiswa.semester} // pakai newProdi
                            onChange={handleNewMahasiswaChange}
                            required
                          />
                        </div>
                        <div className="form-group col-md-3">
                          <label>Angkatan</label>
                          <input
                            type="number"
                            className="form-control"
                            name="classOf"
                            placeholder="Angkatan"
                            value={newMahasiswa.classOf} // pakai newProdi
                            onChange={handleNewMahasiswaChange}
                            required
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label>Golongan UKT</label>
                          <select
                            className="form-control"
                            name="tfGroupId"
                            value={newMahasiswa.tfGroupId} // pakai newProdi
                            onChange={handleNewMahasiswaChange}
                            required
                          >
                            <option>-- Pilih Golongan Ukt --</option>
                            {golUktList.map((f) => (
                              <option key={f.id} value={f.id}>
                                {f.group}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group col-md-6">
                          <label>Kelas</label>
                          <select
                            className="form-control"
                            name="classId"
                            value={newMahasiswa.classId} // pakai newProdi
                            onChange={handleNewMahasiswaChange}
                            required
                          >
                            <option>-- Pilih Kelas --</option>
                            {kelasList.map((f) => (
                              <option key={f.id} value={f.id}>
                                {f.name} ({f.major.name})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="mt-3">
                        <button type="submit" className="btn btn-primary">
                          Simpan Perubahan
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary m-2"
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
                      {mahasiswaList.map((mahasiswa, index) => (
                        <tr key={mahasiswa.id}>
                          <td>{index + 1}</td>
                          <td>{mahasiswa.name}</td>
                          <td>{mahasiswa.email}</td>
                          <td>{mahasiswa.class?.major?.faculty?.name}</td>
                          <td>{mahasiswa.class?.major?.name}</td>
                          <td>{mahasiswa.class?.name}</td>
                          <td>{mahasiswa.tfGroup?.group}</td>
                          <td>{mahasiswa.studentNumber}</td>
                          <td>{mahasiswa.semester}</td>
                          <td>{mahasiswa.classOf}</td>
                          <td>
                            {new Date(mahasiswa.createdAt).toLocaleDateString(
                              "id-ID",
                              {
                                weekday: "long",
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </td>
                          <td>
                            <button
                              className="btn btn-icon btn-primary"
                              onClick={(e) => {
                                e.preventDefault();
                                openEditModal(mahasiswa);
                              }}
                            >
                              <i className="far fa-edit"></i>
                            </button>
                            <a
                              href="#"
                              className="btn btn-icon btn-danger"
                              onClick={(e) => {
                                e.preventDefault();
                                handleDelete(mahasiswa.id)
                              }}
                            >
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
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSave}>
                <div className="modal-header">
                  <h5 className="modal-title">Edit Program Mahasiswa</h5>
                  <button
                    type="button"
                    className="close"
                    onClick={closeEditModal}
                  >
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Nama Mahasiswa</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={selectedMahasiswa.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Nama Dosen</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={selectedMahasiswa.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Semester</label>
                    <input
                      type="text"
                      name="semester"
                      className="form-control"
                      value={selectedMahasiswa.semester}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Angkatan</label>
                    <input
                      type="text"
                      name="classOf"
                      className="form-control"
                      value={selectedMahasiswa.classOf}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Nama Kelas</label>
                    <select
                      className="form-control"
                      name="classId"
                      value={selectedMahasiswa.classId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">-- Pilih Kelas --</option>
                      {kelasList.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name} ({f.major.name})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Golongan Ukt</label>
                    <select
                      className="form-control"
                      name="tfGroupId"
                      value={selectedMahasiswa.tfGroupId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">-- Pilih Golongan Ukt --</option>
                      {golUktList.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.group}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary btn-danger"
                    onClick={closeEditModal}
                  >
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
    </section>
  );
};

export default MahasiswaPage;
