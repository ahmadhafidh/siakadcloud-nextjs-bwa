'use client';
import React, { useState, useEffect } from 'react';
import api from "@/app/lib/axiosInstance";

interface Kelas {
  id: string;
  name: string;
  majorId: string;
  major?: Prodi;
  yearId: string;
  year?: TahunAjaran;
  createdAt: string;
}

interface Fakultas {}
interface Prodi {
  id: string;
  name: string;
  code: string;
  facultyId: string;
}

interface TahunAjaran {
  id: string;
  name: string;
  dateStart: string;
  dateEnd: string;
  status: boolean;
  createdAt: string;
}

//API Services
const getProdi = async() => {
  const res = await api.get("/majors") //bukan http://localhost:5025/api/ -> tapi langsung /lectures
  return res.data.data
}

const getTahunAjaran = async() => {
  const res = await api.get("/years") //bukan http://localhost:5025/api/ -> tapi langsung /lectures
  return res.data.data
}

const getKelas = async() => {
  const res = await api.get("/classes") //bukan http://localhost:5025/api/ -> tapi langsung /classes
  return res.data.data
}

const addKelas = async (data:{
  name: string,
  majorId: string,
  yearId: string
}) => {
  const res = await api.post("/classes", data)
  return res.data
}

const updateKelas = async (
    id: string,
    data:{
      name: string,
      majorId: string,
      yearId: string
    }
) => {
  const res = await api.put(`/classes/${id}`, data)
  return res.data
}

const deleteKelas = async (id: string) => {
  const res = await api.delete(`/classes/${id}`)
  return res.data
}


const KelasPage = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedKelas, setSelectedKelas] = useState<Partial<Kelas>>({});
  const [newKelas, setNewkelas] = useState({
    name: "",
    majorId: "",
    yearId: "",
  });
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [prodiList, setProdiList] = useState<Prodi[]>([]);
  const [tahunAjaranList, setTahunAjaranList] = useState<TahunAjaran[]>([]);
  const [faculties, setFaculties] = useState<{ [key: string]: string }>({});

  //ambil data awal
  useEffect(() => {
      fetchKelas();
      fetchProdi();
      fetchFaculties();
      fetchTahunAjaran();
  }, [])

  const fetchKelas = async () => {
    try {
      const data = await getKelas()
      setKelasList(data);
    } catch (err) {
      console.error("Gagal fetch kelas:", err)
    }
  }

  const fetchProdi = async () => {
    try {
      const data = await getProdi()
      setProdiList(data);
    } catch (err) {
      console.error("Gagal fetch prodi:", err)
    }
  }

  const fetchFaculties = async () => {
    try {
      const res = await api.get("/faculties")
      const data = res.data.data
      // bikin map facultyId -> facultyName
      const map: { [key: string]: string } = {};
      data.forEach((f: any) => {
        map[f.id] = f.name;
      });
      setFaculties(map);
    } catch (err) {
      console.error("Gagal fetch prodi:", err)
    }
  }
  
  const fetchTahunAjaran = async () => {
    try {
      const data = await getTahunAjaran()
      setTahunAjaranList(data);
    } catch (err) {
      console.error("Gagal fetch prodi:", err)
    }
  }

  const openEditModal = (kelas: Kelas) => {
    setSelectedKelas(kelas);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedKelas({});
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSelectedKelas((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewkelasChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewkelas((prev) => ({ ...prev, [name]: value }));
  };


  //create data
  const handleAddNewkelas = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const saved = await addKelas(newKelas)
      setKelasList((prev) => [...prev, saved])
      setNewkelas({ name: "", majorId: "", yearId: "" });
      fetchKelas();
    } catch (err) {
      console.error("Gagal create kelas:", err);
    }
  };

  //update data
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedKelas.id) return;

    try {
      const updated = await updateKelas(selectedKelas.id, {
        name: selectedKelas.name ?? "",
        majorId: selectedKelas?.majorId ?? "",
        yearId: selectedKelas?.yearId ?? "",
      });

      setKelasList((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      closeEditModal();
      fetchKelas();
    } catch (err) {
      console.error("Gagal update kelas:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("yakin hapus kelas ini")) return

    try {
      await deleteKelas(id)
      setKelasList((prev) => prev.filter((p) => p.id !== id))
    } catch (err: any) {
      // Cek apakah error karena foreign key constraint
      if (err.response?.data?.data?.error?.includes("Foreign key constraint")) {
        alert(
          "Kelas tidak bisa dihapus karena masih memiliki data terkait (misal mahasiswa, jadwal, dll)."
        );
      } else {
        alert("Gagal hapus kelas: " + err.message);
      }
      console.error("Gagal hapus kelas:", err);
    }
  }

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
                    <form onSubmit={handleAddNewkelas}>
                      <div className="form-group">
                        <label>Nama Program Studi</label>
                        <select
                          className="form-control"
                          name="majorId"
                          value={newKelas.majorId} // pakai newProdi
                          onChange={handleNewkelasChange}
                          required
                        >
                          <option>-- Pilih Program Studi --</option>
                          {prodiList.map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Nama Tahun Ajaran</label>
                        <select
                          className="form-control"
                          name="yearId"
                          value={newKelas.yearId} // pakai newProdi
                          onChange={handleNewkelasChange}
                          required
                        >
                          <option>-- Pilih Tahun Ajaran --</option>
                          {tahunAjaranList.map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Nama Kelas</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Nama Kelas"
                          name="name"
                          value={newKelas.name}
                          onChange={handleNewkelasChange}
                          required
                        />
                      </div>
                      <button type="submit" className="btn btn-primary">
                        Simpan
                      </button>
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
                          <td>{faculties[kelas.major?.facultyId ?? ""]}</td>
                          <td>{kelas.major?.name}</td>
                          <td>{kelas.year?.name}</td>
                          <td>{kelas.name}</td>
                          <td>
                            {new Date(kelas.createdAt).toLocaleDateString(
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
                                e.preventDefault()
                                openEditModal(kelas)
                              }}
                              className="btn btn-icon btn-primary mx-1"
                            >
                              <i className="far fa-edit"></i>
                            </button>
                            <a
                              href="#"
                              className="btn btn-icon btn-danger"
                              onClick={(e) => {
                                e.preventDefault();
                                handleDelete(kelas.id)
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
                        <h5 className="modal-title" id="editModalLabel">
                          Edit Kelas
                        </h5>
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
                              name="yearId"
                              value={selectedKelas.yearId || ""}
                              onChange={handleInputChange}
                            >
                              {tahunAjaranList.map((t) => (
                                <option key={t.id} value={t.id}>
                                  {t.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group">
                            <label>Program Studi</label>
                            <input
                              className="form-control"
                              name="kelas"
                              value={selectedKelas.name}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="form-group">
                            <label>Tahun Ajaran</label>
                            <input
                              className="form-control"
                              name="tahunAjaran"
                              // value={selectedKelas.tahunAjaran}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="form-group">
                            <label>Nama Kelas</label>
                            <input
                              className="form-control"
                              name="namaKelas"
                              // value={selectedKelas.namaKelas}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      )}
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-dismiss="modal"
                        >
                          Tutup
                        </button>
                        <button
                          // onClick={handleInputChange}
                          className="btn btn-primary"
                        >
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

      {isEditModalOpen && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSave}>
                <div className="modal-header">
                  <h5 className="modal-title">Edit Program Studi</h5>
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
                    <label>Nama Program Studi</label>
                    <select
                      className="form-control"
                      name="majorId"
                      value={selectedKelas.majorId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">-- Pilih Program Studi --</option>
                      {prodiList.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Nama Tahun Ajaran</label>
                    <select
                      className="form-control"
                      name="yearId"
                      value={selectedKelas.yearId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">-- Pilih Tahun Ajaran --</option>
                      {tahunAjaranList.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Nama Kelas</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={selectedKelas.name}
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

export default KelasPage;
