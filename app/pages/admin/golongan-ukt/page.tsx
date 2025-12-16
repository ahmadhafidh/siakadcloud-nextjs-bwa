
"use client";
// import MyBarChart from '../../../components/myBarChart';

import api from "@/app/lib/axiosInstance"
import React, { useEffect, useState } from 'react';

interface Ukt {
  id: string,
  group: string,
  amount: number,
  createdAt: string,
}

//api get all data
const getGolUkt = async () => {
  const res = await api.get("/tf-groups")
  return res.data.data
}

const addGolUkt = async(data: {group:string; amount: number}) => {
  const res = await api.post("/tf-groups", data)
  return res.data
}

//api update data
const updateGolUkt = async(
   id:string,
   data: {group?:string; amount?:number }
) => {
  const res = await api.put(`/tf-groups/${id}`, data)
  return res.data
}

//api delete data
const deleteGolUkt = async(id:string) => {
  const res = await api.delete(`/tf-groups/${id}`)
  return res.data
}


const GolUKTPage = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedGolUkt, setSelectedGolUkt] = useState<Partial<Ukt>>({})
  const [newGolUkt, setNewGolUkt] = useState({
    group: "",
    amount: null,
  })
  const [golUktList, setGolUktList] = useState<Ukt[]>([])

  //ambil data awal
  useEffect(() => {
    fetchGolUkt()
  }, [])
  
  //get all data
  const fetchGolUkt = async () => {
    try {
      const data = await getGolUkt()
      setGolUktList(data)
    } catch (err) {
      console.error("Gagal fetch golongan ukt:", err)
    }
  }

  //start of popup keperluan edit
  const openEditModal = (ukt:Ukt) =>{
    setSelectedGolUkt(ukt)
    setIsEditModalOpen(true)
  }
  const closeEditModal = () =>{
    setIsEditModalOpen(false)
    setSelectedGolUkt({})
  }
  //end of popup keperluan edit
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSelectedGolUkt((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  }

  const handleNewGolUktChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewGolUkt((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  }

  const handleAddNewGolUkt = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const payload = {
        group: newGolUkt.group,
        amount: Number(newGolUkt.amount) //pastikan number
      }
      const saved = await addGolUkt(payload)
      
      setGolUktList((prev) => [...prev, saved]);
      setNewGolUkt({ group: "", amount: null });
      fetchGolUkt();
    } catch (err) {
      console.error("Gagal tambah golongan UKT:", err);
    }
  }

  //ketika button submit di klik
  const handleSave = async(e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(!selectedGolUkt.id) return

    try {
      const updated = await updateGolUkt(selectedGolUkt.id, {
        group:selectedGolUkt.group,
        amount:selectedGolUkt.amount,
      })

      setGolUktList((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
    );

      closeEditModal();
      fetchGolUkt();
    } catch (err) {
      console.error("Gagal update gol ukt:", err);
    }
  }

  //ketika button delete di klik
  const handleDelete = async (id: string) => {
    if(!confirm("Yakin hapus golongan ukt ini?")) return

    try {
      await deleteGolUkt(id);
      setGolUktList((prev) => prev.filter((p) => p.id !== id));
      alert("Golongan ukt berhasil dihapus!");
    } catch (err: any) {
      // Cek apakah error karena foreign key constraint
      if (err.response?.data?.data?.error?.includes("Foreign key constraint")) {
        alert(
          "Golongan ukt tidak bisa dihapus karena masih memiliki data terkait (misal mahasiswa, jadwal, dll)."
        );
      } else {
        alert("Gagal hapus golongan ukt: " + err.message);
      }
      console.error("Gagal hapus golongan ukt:", err);
    }
  }
  return (
    <section className="section">
      <div className="section-header">
        <h1>Pembayaran</h1>
        <div className="section-header-breadcrumb">
          <div className="breadcrumb-item">Pembayaran</div>
          <div className="breadcrumb-item">
            <a href="../pembayaran/golongan-ukt.html">Golongan Kuliah Tunggal</a>
          </div>
        </div>
      </div>

      <div className="section-body">
        <h2 className="section-title">Golongan UKT</h2>
        <p className="section-lead">
          Menampilkan semua data Golongan UKT yang ada pada universitas ini
        </p>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <button
                  className="btn btn-primary btn-sm footer-left mb-2"
                  type="button"
                  data-toggle="collapse"
                  data-target="#collapseEditGolonganUKT"
                >
                  Tambah Golongan UKT
                </button>
                <div className="collapse" id="collapseEditGolonganUKT">
                  <div className="card card-body">
                    <form onSubmit={handleAddNewGolUkt}>
                      <div className="form-group">
                        <label>Golongan</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Nama Golongan"
                          value={newGolUkt.group}
                          onChange={handleNewGolUktChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Jumlah</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Jumlah"
                          value={newGolUkt.amount ?? ""}
                          onChange={handleNewGolUktChange}
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
                  <table className="table table-striped" id="table-1">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Golongan</th>
                        <th>Jumlah</th>
                        <th>Dibuat pada</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {golUktList.map((ukt,index) => (
                        <tr key={ukt.id}>
                          <td>{index + 1}</td>
                          <td>{ukt.group}</td>
                          <td>
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                            }).format(ukt.amount)}
                          </td>
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
                              className="btn btn-icon btn-primary" 
                              onClick={()=> openEditModal(ukt)}
                            >
                              <i className="far fa-edit"></i>
                            </button>
                            <button
                              onClick={() => handleDelete(ukt.id)}
                              className="btn btn-icon btn-danger"
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {isEditModalOpen && (
                    <div
                      className="modal fade show"
                      style={{
                        display: "block",
                        backgroundColor: "rgba(0,0,0,0.5)",
                      }}
                    >
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <form onSubmit={handleSave}>
                            <div className="modal-header">
                              <h5 className="modal-title">
                                Edit Program Studi
                              </h5>
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
                                <label>Nama Golongan</label>
                                <input
                                  type="text"
                                  name="group"
                                  className="form-control"
                                  value={selectedGolUkt.group}
                                  onChange={handleInputChange}
                                />
                              </div>
                              <div className="form-group">
                                <label>Jumlah</label>
                                <input
                                  type="number"
                                  name="amount"
                                  className="form-control"
                                  value={selectedGolUkt.amount}
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GolUKTPage;
