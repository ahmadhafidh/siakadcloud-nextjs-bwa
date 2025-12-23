
'use client';
import React, { useState, useEffect } from 'react';
import api from "@/app/lib/axiosInstance";

interface Matkul {
  id: string;
  name: string;
  code: string;
  lectureId: string;
  credits: number;
  lecture: Dosen;
  createdAt: string;
}

interface Dosen {
  id: string;
  name: string;
  major: Prodi;
}

interface Prodi {
  id: string;
  name: string;
  faculty: Fakultas;
}

interface Fakultas {
  id: string;
  name: string;
}

// API Services
const getDosen = async () => {
  const res = await api.get("/lectures");
  return res.data.data;
};
const getMatkul = async () => {
  const res = await api.get("/courses");
  return res.data.data;
};
const addMatkul = async (data: {
  name: string;
  code: string;
  lectureId: string;
  credits: number;
}) => {
  const res = await api.post("/courses", data);
  return res.data;
};
const updateMatkul = async (
  id: string,
  data: {
    name: string;
    code: string;
    lectureId: string;
    credits: number;
  }
) => {
  const res = await api.put(`/courses/${id}`, data);
  return res.data;
};
const deleteMatkul = async (id: string) => {
  const res = await api.delete(`/courses/${id}`);
  return res.data;
};


const MatkulPage = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMatkul, setSelectedMatkul] = useState<Partial<Matkul>>({});
  const [newMatkul, setNewMatkul] = useState({
    name: "",
    code: "",
    lectureId: "",
    credits: 0,
  });
  const [matkulList, setMatkulList] = useState<Matkul[]>([]);
  const [dosenList, setDosenList] = useState<Dosen[]>([]);

  useEffect(() => {
    fetchDosen()
    fetchMatkul()
  }, [])
  
  const fetchDosen = async () => {
    try {
      const data = await getDosen()
      setDosenList(data)
    } catch (err) {
      console.error("gagal fetch data dosen: ", err)
    }
  }
  const fetchMatkul = async () => {
    try {
      const data = await getMatkul()
      setMatkulList(data)
    } catch (err) {
      console.error("gagal fetch data matkul: ", err)
    }
  }
  

  //create data
  const handleNewMatkulChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewMatkul((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNewMatkul = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const saved = await addMatkul(newMatkul);
      setMatkulList((prev) => [...prev, saved]);
      setNewMatkul({
        name: "",
        code: "",
        lectureId: "",
        credits: 0,
      });
      fetchMatkul();
    } catch (err) {
      console.error("Gagal tambah matkul:", err);
    }
  };
  //create data

  //delete data
  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus matkul ini?")) return;

    try {
      await deleteMatkul(id);
      setMatkulList((prev) => prev.filter((p) => p.id !== id));
      alert("Matkul berhasil dihapus!");
    } catch (err: any) {
      // Cek apakah error karena foreign key constraint
      if (err.response?.data?.data?.error?.includes("Foreign key constraint")) {
        alert(
          "Matkul tidak bisa dihapus karena masih memiliki data terkait (misal mahasiswa, jadwal, dll)."
        );
      } else {
        alert("Gagal hapus matkul: " + err.message);
      }
      console.error("Gagal hapus matkul:", err);
    }
  };
  // delete data

  //start of update data
  // 1. do open popup
  const openEditModal = (matkul: Matkul) => {
    setSelectedMatkul(matkul);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedMatkul({});
  };

  // 2. are input and select data is there any changes?
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSelectedMatkul((prev) => ({ ...prev, [name]: value }));
  };

  // 3. do update data with API
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedMatkul.id) return;

    try {
      const updated = await updateMatkul(selectedMatkul.id, {
        name: selectedMatkul.name ?? "",
        code: selectedMatkul.code ?? "",
        lectureId: selectedMatkul.lectureId ?? "",
        credits: selectedMatkul.credits ?? 0,
      });

      setMatkulList((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      closeEditModal();
      fetchMatkul();
    } catch (err) {
      console.error("Gagal update matkul:", err);
    }
  };
  //end of update data


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
                {/* tambah data */}
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
                    <form onSubmit={handleAddNewMatkul}>
                      <div className="form-group">
                        <label htmlFor="prodi">Dosen</label>
                          <select
                            className="form-control"
                            name="lectureId"
                            value={newMatkul.lectureId} // pakai newProdi
                            onChange={handleNewMatkulChange}
                            required
                          >
                            <option>-- Pilih Dosen --</option>
                            {dosenList.map((f) => (
                              <option key={f.id} value={f.id}>
                                {f.name} ({f.major?.name}) ({f.major.faculty.name}
                                )
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Kode Mata Kuliah</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Kode Mata Kuliah"
                          name="code" value={newMatkul.code}
                          onChange={handleNewMatkulChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Nama Mata Kuliah</label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          placeholder="Nama Mata Kuliah"
                          value={newMatkul.name}
                          onChange={handleNewMatkulChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>SKS</label>
                        <input
                          type="text"
                          className="form-control"
                          name="credits"
                          placeholder="SKS"
                          value={newMatkul.credits}
                          onChange={handleNewMatkulChange}
                          required
                        />
                      </div>
                      <button type="submit" className="btn btn-primary">
                        Simpan
                      </button>
                    </form>
                  </div>
                </div>
                {/* tambah data */}

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
                      {matkulList.map((matkul,index) => (
                        <tr key={matkul.id}>
                          <td>{index +1 }</td>
                          <td>{matkul.lecture?.major?.faculty?.name ?? ""}</td>
                          <td>{matkul.lecture?.major?.name ?? ""}</td>
                          <td>{matkul.lecture?.name ?? ""}</td>
                          <td>{matkul.code}</td>
                          <td>{matkul.name}</td>
                          <td>{matkul.credits}</td>
                          <td>
                            {new Date(matkul.createdAt).toLocaleDateString(
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
                                openEditModal(matkul);
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
                                handleDelete(matkul.id!);
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
                  <h5 className="modal-title">Edit Mata Kuliah</h5>
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
                    <label>Dosen</label>
                    <select
                      className="form-control"
                      name="lectureId"
                      value={selectedMatkul.lectureId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">-- Pilih Dosen --</option>
                      {dosenList.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name} ({f.major.name}) ({f.major.faculty.name})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Kode Mata Kuliah</label>
                    <input
                      type="text"
                      name="code"
                      className="form-control"
                      value={selectedMatkul.code}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Nama Mata Kuliah</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={selectedMatkul.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Credits</label>
                    <input
                      type="number"
                      name="credits"
                      className="form-control"
                      value={selectedMatkul.credits}
                      onChange={handleInputChange}
                      required
                    />
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

export default MatkulPage;
