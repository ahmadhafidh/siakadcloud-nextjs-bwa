
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

interface Kelas {
  id: string;
  name: string;
  majorId: string;
  major: Prodi;
}

interface Ukt {
  id: string;
  studentId: string;
  status: string;
  student: Mahasiswa;
  createdAt: string;
}

//API services
const getMahasiswa = async () => {
  const res = await api.get("/students");
  return res.data.data;
};
const getProdi = async () => {
  const res = await api.get("/majors");
  return res.data.data;
};
const getUkt = async () => {
  const res = await api.get("/tuition-fees");
  return res.data.data;
};
const addUkt = async (data: { studentId: string; status: string }) => {
  const res = await api.post("/tuition-fees", data);
  return res.data;
};
const updateUkt = async (
  id: string,
  data: { studentId?: string; status?: string }
) => {
  const res = await api.put(`/tuition-fees/${id}`, data);
  return res.data;
};
const deleteUkt = async (id: string) => {
  const res = await api.delete(`/tuition-fees/${id}`);
  return res.data;
};

const UKTPage = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUkt, setSelectedUkt] = useState<Partial<Ukt>>({});
  const [newUkt, setNewUkt] = useState({
    studentId: "",
    status: "",
  });
  const [uktList, setUktList] = useState<Ukt[]>([]);
  const [MahasiswaList, setMahasiswaList] = useState<Mahasiswa[]>([]);
  const [prodi, setProdi] = useState<any[]>([]);

  //ambil data awal
  useEffect(() => {
    fetchMahasiswa();
    fetchProdi();
    fetchUkt();
  }, [])

  const fetchMahasiswa = async () => {
    try {
      const data = await getMahasiswa();
      setMahasiswaList(data);
    } catch (err) {
      console.error("Gagal fetch mahasiswa:", err);
    }
  };

  const fetchProdi = async () => {
    try {
      const data = await getProdi();
      setProdi(data);
    } catch (err) {
      console.error("Gagal fetch prodi:", err);
    }
  };

  const fetchUkt = async () => {
    try {
      const data = await getUkt();
      setUktList(data);
    } catch (err) {
      console.error("Gagal fetch ukt:", err);
    }
  };

  const getProdiAndFakultas = (majorId: string) => {
    const prodis = prodi.find((m) => m.id === majorId);
    if (!prodis) return { majorName: "-", facultyName: "-" };
    return { majorName: prodis.name, facultyName: prodis.faculty?.name || "-" };
  };
  

  //start of create data
  const handleNewUktChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewUkt((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNewUkt = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const saved = await addUkt(newUkt);
      setUktList((prev) => [...prev, saved]);
      setNewUkt({ studentId: "", status: "" });
      fetchUkt();
    } catch (err) {
      console.error("Gagal tambah ukt:", err);
    }
  };
  //end of create data

  //delete data
  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus ukt ini?")) return;

    try {
      await deleteUkt(id);
      setUktList((prev) => prev.filter((p) => p.id !== id));
      alert("Ukt berhasil dihapus!");
    } catch (err: any) {
      // Cek apakah error karena foreign key constraint
      if (err.response?.data?.data?.error?.includes("Foreign key constraint")) {
        alert(
          "Ukt tidak bisa dihapus karena masih memiliki data terkait (misal mahasiswa, jadwal, dll)."
        );
      } else {
        alert("Gagal hapus Ukt: " + err.message);
      }
      console.error("Gagal hapus Ukt:", err);
    }
  };

  //update data
  // 1. open modal / popup
  const openEditModal = (ukt: Ukt) => {
    setSelectedUkt(ukt);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUkt({});
  };

  // 2. cek apakah di input / selectoption ada data yang berubah
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSelectedUkt((prev) => ({ ...prev, [name]: value }));
  };

  // 3. lakukan update data 
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUkt.id) return;

    try {
      const updated = await updateUkt(selectedUkt.id, {
        status: selectedUkt.status ?? "",
      });

      setUktList((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      closeEditModal();
      fetchUkt();
    } catch (err) {
      console.error("Gagal update ukt:", err);
    }
  };

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
                    <form onSubmit={handleAddNewUkt}>
                      <div className="form-group">
                        <label htmlFor="nama">Nama</label>
                        <select
                          className="form-control"
                          name="studentId"
                          value={newUkt.studentId} // pakai newProdi
                          onChange={handleNewUktChange}
                          required
                        >
                          <option>-- Pilih Mahasiswa --</option>
                          {MahasiswaList.map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Status</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Status"
                          name="status"
                          value={newUkt.status} // pakai newProdi
                          onChange={handleNewUktChange}
                        />
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
                      {
                        uktList.map((ukt, index)=> (
                          <tr key={ukt.id}>
                            <td>{index + 1}</td>
                            <td>
                              {
                                getProdiAndFakultas(
                                  ukt.student?.class?.majorId ?? ""
                                ).facultyName
                              }
                            </td>
                            <td>
                              {
                                getProdiAndFakultas(
                                  ukt.student?.class?.majorId ?? ""
                                ).majorName
                              }
                            </td>
                            <td>{ukt.student?.name ?? ""}</td>
                            <td>{ukt.student?.studentNumber ?? ""}</td>
                            <td>{ukt.student?.semester ?? ""}</td>
                            <td>{ukt.status ?? ""}</td>
                            <td>
                              {new Date(ukt.createdAt).toLocaleDateString(
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
                                onClick={(e) => {
                                  e.preventDefault();
                                  openEditModal(ukt);
                                }}
                                className="btn btn-icon btn-primary"
                              >
                                <i className="far fa-edit"></i>
                              </button>
                              <a
                                href="#"
                                className="btn btn-icon btn-danger"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDelete(ukt.id);
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
                  <h5 className="modal-title">Edit Ukt</h5>
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
                      name="studentId"
                      className="form-control"
                      value={selectedUkt.student?.name}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <input
                      type="text"
                      name="status"
                      className="form-control"
                      value={selectedUkt.status}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
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

export default UKTPage;
