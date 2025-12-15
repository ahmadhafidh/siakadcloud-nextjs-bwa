'use client';
import React, { useEffect, useState } from 'react';
import api from "@/app/lib/axiosInstance";

interface Fakultas {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}
interface Prodi {
  id: number;
  name: string;
  code: string;
  facultyId: string;
  faculty?: Fakultas;
  createdAt: string;
}

// API Services
const getProdi = async () => {
  const res = await api.get("/majors")
  return res.data.data;
}

const getFakultas = async () => {
  const res = await api.get("/faculties")
  return res.data.data;
}

const addProdi = async (data: {
  name:string;
  code:string
  facultyId:string
}) => {
  const res = await api.post("/majors", data)
  return res.data
}

const updateProdi = async (
  id: number,
  data: {name?: string; code?: string; facultyId?: string}
) => {
  const res = await api.put(`/majors/${id}`, data)
  return res.data
}

const deleteProdi = async (id:number) => {
  const res = await api.delete(`/majors/${id}`)
  return res.data
}

const ProdiPage = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProdi, setSelectedProdi] = useState<Partial<Prodi>>({});
  const [newProdi, setNewProdi] = useState({
    name: "",
    code: "",
    facultyId: "",
  });
  const [prodiList, setProdiList] = useState<Prodi[]>([]);
  const [fakultasList, setFakultasList] = useState<Fakultas[]>([]);

  //ambil data awal
  useEffect(() => {
    fetchProdi()
    fetchFakultas()
  }, [])

  const fetchFakultas = async () => {
    try {
      const data = await getFakultas()
      setFakultasList(data)
    } catch (err) {
      console.log("Gagal fetch fakultas", err)
    }
  }

  const fetchProdi = async () => {
    try {
      const data = await getProdi();
      setProdiList(data);
    } catch (err) {
       console.log("Gagal fetch prodi", err)
    }
  }
  
  const openEditModal = (prodi: Prodi) => {
    setSelectedProdi(prodi);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProdi({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSelectedProdi((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewProdiChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProdi((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNewProdi = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const saved = await addProdi(newProdi);
      setProdiList((prev) => [...prev, saved]);
      setNewProdi({ name: "", code: "", facultyId: "" });
      fetchProdi();
    } catch (err) {
      console.error("Gagal tambah prodi:", err);
    }
  };

  const handleSave = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!selectedProdi.id) return
    try {
      const updated = await updateProdi(selectedProdi.id, {
        name: selectedProdi.name,
        code: selectedProdi.code,
        facultyId: selectedProdi.facultyId,
      })
      setProdiList((prev)=>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      fetchProdi();
      closeEditModal();
    } catch (err) {
      console.error("Gagal update prodi:", err);
    }
  };

  const handleDelete = async (id:number) => {
    try {
      await deleteProdi(id)
      fetchProdi();
      alert("Prodi berhasil dihapus!");
    } catch (err:any) {
      // Cek apakah error karena foreign key constraint
      if (err.response?.data?.data?.error?.includes("Foreign key constraint")) {
        alert(
          "Prodi tidak bisa dihapus karena masih memiliki data terkait (misal mahasiswa, jadwal, dll)."
        );
      } else {
        alert("Gagal hapus prodi: " + err.message);
      }
      console.error("Gagal hapus prodi:", err);
    }
  }

  return (
    <section className="section">
      <div className="section-header">
        <h1>Master</h1>
        <div className="section-header-breadcrumb">
          <div className="breadcrumb-item">Master</div>
          <div className="breadcrumb-item"><a href="/admin/prodi">Program Studi</a></div>
        </div>
      </div>

      <div className="section-body">
        <h2 className="section-title">Program Studi</h2>
        <p className="section-lead">
          Menampilkan semua data Program Studi yang ada pada universitas ini
        </p>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <button className="btn btn-primary btn-sm mb-2" type="button" data-toggle="collapse" data-target="#collapseTambahProdi">
                  Tambah Prodi
                </button>
                <div className="collapse" id="collapseTambahProdi">
                  <div className="card card-body">
                    <form onSubmit={handleAddNewProdi}>
                      <div className="form-group">
                        <label htmlFor="fakultas">Nama Fakultas</label>
                        <select
                          className="form-control"
                          id="fakultas"
                          name="facultyId"
                          value={newProdi.facultyId} // pakai newProdi
                          onChange={handleNewProdiChange} // pakai handler newProdi
                          required
                        >
                            <option value="">-- Pilih Fakultas --</option>
                            {fakultasList.map((f)=> (
                              <option key={f.id} value={f.id}>
                                {f.name}
                              </option>
                            ))}
                          
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Nama Prodi</label>
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          placeholder="Nama Prodi"
                          value={newProdi.name}
                          onChange={handleNewProdiChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Kode</label>
                        <input
                          type="text"
                          name="code"
                          className="form-control"
                          placeholder="Kode"
                          value={newProdi.code}
                          onChange={handleNewProdiChange}
                          required
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
                        <th>Nama</th>
                        <th>Kode</th>
                        <th>Dibuat pada</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prodiList.map((prodi, index) => (
                        <tr key={prodi.id ?? `new-${index}`}>
                          <td>{index + 1}</td>
                          <td>{prodi.faculty?.name}</td>
                          <td>{prodi.name}</td>
                          <td>{prodi.code}</td>
                          <td>
                            {new Date(prodi.createdAt).toLocaleDateString(
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
                            <a href="#" className="btn btn-icon btn-primary" onClick={(e) => { e.preventDefault(); openEditModal(prodi); }}>
                              <i className="far fa-edit"></i>
                            </a>
                            <a
                              href="#"
                              className="btn btn-icon btn-danger"
                              onClick={(e) => {
                                e.preventDefault();
                                handleDelete(prodi.id!);
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
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSave}>
                <div className="modal-header">
                  <h5 className="modal-title">Edit Program Studi</h5>
                  <button type="button" className="close" onClick={closeEditModal}>
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Nama Fakultas</label>
                    <select
                      name="facultyId"
                      className="form-control"
                      value={selectedProdi.facultyId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">-- Pilih Fakultas --</option>
                      {fakultasList.map((f)=> (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Nama Prodi</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={selectedProdi.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Kode</label>
                    <input
                      type="text"
                      name="code"
                      className="form-control"
                      value={selectedProdi.code}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeEditModal}>Batal</button>
                  <button type="submit" className="btn btn-primary">Simpan</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProdiPage;
