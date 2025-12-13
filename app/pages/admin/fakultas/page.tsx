'use client';
import api from "@/app/lib/axiosInstance"
import React, { useEffect, useState } from 'react';

interface Fakultas {
  id: number, 
  name: string,
  code:string,
  createdAt: string
}

// API Services
const getFakultas = async () => {
  const res = await api.get("/faculties")
  console.log(res.data.data)
  return res.data.data;
}

const addFakultas = async (data: {name:string; code:string}) => {
  const res = await api.post("/faculties", data)
  return res.data
}

const updateFakultas = async (
  id: number,
  data: {name?: string; code?: string}
) => {
  const res = await api.put (`/faculties/${id}`, data)
  return res.data
}

const deleteFakultas = async (id:number) => {
  const res = await api.delete(`/faculties/${id}`)
  return res.data
}

const FakultasPage = () => {
  const [fakultasList, setFakultasList] = useState<Fakultas[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedFakultas, setSelectedFakultas] = useState<Fakultas | null>(
    null
  );
  
  // State input tambah/edit
  const [nama, setNama] = useState("")
  const [kode, setKode] = useState("")

  // State untuk search, sorting, pagination
  // const[globalFilter, setGlobalFilter] = useState("")
  // const [sorting, setSorting] = useState<SortingState>([
  //   { id: "name", desc: false },
  // ]);
  // const [pagination, setPagination] = useState({
  //   pageIndex: 0,
  //   pageSize: 10,
  // });

  // Generate kode otomatis dari nama
  const generateKode = (namaFakultas: string) => {
    if (!namaFakultas) return "";
    return namaFakultas
      .split(" ") // pisah per kata
      .map((kata) => kata[0]?.toUpperCase()) // ambil huruf pertama
      .join(""); // misal "FT" dari "Fakultas Teknik"
  };

  const handleNamaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNama(value);
    setKode(generateKode(value)) // otomatis update kode saat nama diubah
  }

  //ambil data awal
  useEffect(() => {
    fetchFakultas();
  }, [])

  const fetchFakultas = async () => {
    setLoading(true);
    const data = await getFakultas()
    setFakultasList(data)
    setLoading(false)
  }

  //tambah
  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault()
    await addFakultas({name: nama, code: kode})

    setNama("");
    setKode("");
    fetchFakultas();
  }

  // Edit
  const openEditModal = (fakultas:Fakultas) => {
    setSelectedFakultas(fakultas)
    setIsEditModalOpen(true);
  }
  
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedFakultas(null);
  }

  // const handleInputChange = async (e:React.FormEvent) => {
  //   e.preventDefault()
  //   if (selectedFakultas) {
  //     await updateFakultas(selectedFakultas.id, {
  //       name: selectedFakultas.name,
  //       code: selectedFakultas.code,
  //     });
  //     fetchFakultas();
  //     closeEditModal();
  //   }
  // }

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFakultas) {
      await updateFakultas(selectedFakultas.id, {
        name: selectedFakultas.name,
        code: selectedFakultas.code,
      });
      fetchFakultas();
      closeEditModal();
    }
  };


  // Hapus
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus fakultas ini")) return

    try {
      await deleteFakultas(id)
      setFakultasList((prev) => prev.filter((p) => p.id !== id));
      alert("Fakultas berhasil dihapus")
    } catch (err:any) {
      // Cek apakah error karena foreign key constraint
      if (err.response?.data?.data?.error?.includes("Foreign key constraint")) {
        alert(
          "Fakultas tidak bisa dihapus karena masih memiliki data terkait prodi."
        );
      } else {
        alert("Gagal hapus prodi: " + err.message);
      }
      console.error("Gagal hapus prodi:", err);
    }
    fetchFakultas();
  };

  // wrapper agar cocok dengan tipe onChange di FieldConfig
  // const handleNamaChangeWrapper = (
  //   e:
  //     | React.ChangeEvent<
  //       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  //     >
  //     | SelectOption
  //     | null
  // ) => {
  //   if (e && "target" in e) {
  //     handleNamaChange(e as React.ChangeEvent<HTMLInputElement>);
  //   }
  // }

  return (
    <section className="section">
      <div className="section-header">
        <h1>Master</h1>
        <div className="section-header-breadcrumb">
          <div className="breadcrumb-item">Master</div>
          <div className="breadcrumb-item"><a href="#">Fakultas</a></div>
        </div>
      </div>

      <div className="section-body">
        <h2 className="section-title">Fakultas</h2>
        <p className="section-lead">Menampilkan semua data fakultas yang ada pada universitas ini</p>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <button
                  className="btn btn-primary btn-sm footer-left mb-2"
                  type="button"
                  data-toggle="collapse"
                  data-target="#collapseTambahFakultas"
                >
                  Tambah Fakultas
                </button>
                <div className="collapse" id="collapseTambahFakultas">
                  <div className="card card-body">
                    <form onSubmit={handleSubmit}>
                      <div className="form-group">
                        <label>Nama Fakultas</label>
                        <input type="text" className="form-control" placeholder="Nama Fakultas" value={nama} onChange={handleNamaChange} />
                      </div>
                      <div className="form-group">
                        <label>Kode</label>
                        <input
                          type="text"
                          className="form-control"
                          value={kode}
                          readOnly
                        />
                      </div>
                      <button type="submit" className="btn btn-primary">Simpan</button>
                    </form>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Nama</th>
                        <th>Kode</th>
                        <th>Dibuat pada</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fakultasList.map((fakultas, index) => (
                        <tr key={fakultas.id}>
                          <td>{index + 1}</td>
                          <td>{fakultas.name}</td>
                          <td>{fakultas.code}</td>
                          <td>
                            {new Date(fakultas.createdAt).toLocaleDateString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </td>
                          <td>
                            <a
                              href="#"
                              className="btn btn-icon btn-primary"
                              onClick={(e) => {
                                e.preventDefault();
                                openEditModal(fakultas);
                              }}
                            >
                              <i className="far fa-edit"></i>
                            </a>
                            <a
                              href="#"
                              className="btn btn-icon btn-danger"
                              onClick={(e) => {
                                e.preventDefault();
                                handleDelete(fakultas.id);
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
                {isEditModalOpen && (
                  <div className="modal fade show" style={{
                    display: 'block',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1050,
                  }}>
                    <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content">
                        <form onSubmit={handleEditSave}>
                          <div className="modal-header">
                            <h5 className="modal-title">Edit Fakultas</h5>
                            <button type="button" className="close" onClick={closeEditModal}>
                              <span>&times;</span>
                            </button>
                          </div>
                          <div className="modal-body">
                            <div className="form-group">
                              <label>Nama Fakultas</label>
                              <input
                                type="text"
                                className="form-control"
                                value={selectedFakultas.name}
                                onChange={(e) =>
                                  setSelectedFakultas({
                                    ...selectedFakultas,
                                    name: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label>Kode</label>
                              <input
                                type="text"
                                className="form-control"
                                value={selectedFakultas.code}
                                onChange={(e) =>
                                  setSelectedFakultas({
                                    ...selectedFakultas,
                                    code: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>
                          </div>
                          <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={closeEditModal}>
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

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FakultasPage;
