'use client';
import React, { useState, useEffect } from 'react';
import api from "@/app/lib/axiosInstance";

interface Pembayaran {
  id: string;
  code: string;
  status: string;
  createdAt: string;
  studentId: string;
  student: Mahasiswa;
}

interface Mahasiswa {
  id: string;
  name: string;
  studentNumber: string;
  semester: string;
  class: Kelas;
  tfGroup: GolUkt;
}

interface GolUkt {
  id: string;
  group: string;
}

interface Kelas {
  name: string;
  year: TahunAjaran;
}

interface TahunAjaran {
  id: string;
  name: string;
}


// API Services
const getMahasiswa = async () => {
  const res = await api.get("/students");
  return res.data.data;
};
const getPembayaran = async () => {
  const res = await api.get("/payments");
  return res.data.data;
};
const addPembayaran = async (data: {
  studentId: string;
  code: string;
  status: string;
}) => {
  const res = await api.post("/payments", data);
  return res.data;
};
const updatePembayaran = async (
  id: string,
  data: {
    status: string;
  }
) => {
  const res = await api.put(`/payments/${id}`, data);
  return res.data;
};
// const deletePembayaran = async (id: string) => {
//   const res = await api.delete(`/payments/${id}`);
//   return res.data;
// };

const PembayaranPage = () => {
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // const [selectedPembayaran, setSelectedPembayaran] = useState<
  //   Partial<Pembayaran>
  // >({});
  const [newPembayaran, setNewPembayaran] = useState({
    studentId: "",
    code: "",
    status: "UNPAID",
  });
  const [pembayaranList, setPembayaranList] = useState<Pembayaran[]>([]);
  const [mahasiswaList, setMahasiswaList] = useState<Mahasiswa[]>([]);

  useEffect(() => {
    fetchPembayaran();
    fetchMahasiswa();
  }, [])

  const fetchMahasiswa = async () => {
    try {
      const data = await getMahasiswa();
      setMahasiswaList(data);
    } catch (err) {
      console.error("Gagal fetch mahasiswa:", err);
    }
  };

  const fetchPembayaran = async () => {
    try {
      const data = await getPembayaran();
      setPembayaranList(data);
    } catch (err) {
      console.error("Gagal fetch matkul:", err);
    }
  };

  //update data with API
  const handleToggleStatus = async (pembayaran: Pembayaran) => {
    try {
      const newStatus = pembayaran.status === "UNPAID" ? "PAID" : "UNPAID"
      const updated = await updatePembayaran(pembayaran.id, {
        status: newStatus
      })
      setPembayaranList((prev) => 
        prev.map((p) => (p.id === updated.id ? updated : p))
      )
      fetchPembayaran()
    } catch (err) {
      console.error("Gagal toggle status pembayaran:", err);
    }
  }

  //create data with API
  // 1. untuk generate paymentCode
  const generatePaymentCode = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4 digit
    return `PAY${year}${month}${day}${randomNum}`;
  };

  // 2. cek dengan react changevent apakah ada inputan / select yang ada perubahan data?
  const handleNewPembayaranChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewPembayaran((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNewPembayaran = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      const payload = {
        ...newPembayaran,
        code: generatePaymentCode(), // auto generate di sini saja
      };
      const saved = await addPembayaran(payload);
      setPembayaranList((prev) => [...prev, saved]);

      // reset form
      setNewPembayaran({
        studentId: "",
        code: "",
        status: "UNPAID", // default balik ke UNPAID
      });

      fetchPembayaran();
    } catch (err) {
      console.error("Gagal tambah pembayaran:", err);
    }
  };

  return (
    <section className="section">
      <div className="section-header">
        <h1>Pembayaran</h1>
      </div>

      <div className="section-body">
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
                  Tambah Data Pembayaran
                </button>
                <div className="collapse" id="collapseEditMatkul">
                  <div className="card card-body">
                    <form onSubmit={handleAddNewPembayaran}>
                      <div className="form-group">
                        <label htmlFor="prodi">Nama Mahasiswa</label>
                        <select
                          className="form-control"
                          name="studentId"
                          value={newPembayaran.studentId} // pakai newProdi
                          onChange={handleNewPembayaranChange}
                          required
                        >
                          <option>-- Pilih Mahasiswa --</option>
                          {mahasiswaList.map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.name} ({f.tfGroup.group}) ({f.class.name})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="prodi">Status</label>
                        <select
                          className="form-control"
                          name="status"
                          value={newPembayaran.status} // pakai newProdi
                          onChange={handleNewPembayaranChange}
                          required
                        >
                          <option key="UNPAID" value="UNPAID">
                            UNPAID
                          </option>
                          <option key="PAID" value="PAID">
                            PAID
                          </option>
                        </select>
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
                        <th>Nama</th>
                        <th>NIM</th>
                        <th>Kode Pembayaran</th>
                        <th>Golongan</th>
                        <th>Tahun Ajaran</th>
                        <th>Semester</th>
                        <th>Status</th>
                        <th>Dibuat Pada</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pembayaranList.map((pembayaran, index) => (
                        <tr key={pembayaran.id || index}>
                          <td>{index + 1 }</td>
                          <td>{pembayaran.student?.name ?? ""}</td>
                          <td>{pembayaran.student?.studentNumber ?? ""}</td>
                          <td>{pembayaran.code ?? ""}</td>
                          <td>{pembayaran.student?.tfGroup.group ?? ""}</td>
                          <td>{pembayaran.student?.class.year.name ?? ""}</td>
                          <td>{pembayaran.student?.semester ?? ""}</td>
                          <td>
                            <span
                              className={`badge ${
                                pembayaran.status?.toLowerCase() === "paid"
                                  ? "badge-success"
                                  : pembayaran.status?.toLowerCase() ===
                                    "unpaid"
                                  ? "badge-warning"
                                  : "badge-secondary" // default kalau tidak cocok
                              }`}
                            >
                              {pembayaran.status}
                            </span>
                          </td>
                          <td>
                            {new Date(pembayaran.createdAt).toLocaleDateString(
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
                                handleToggleStatus(pembayaran);
                              }}
                              className={`btn btn-sm mx-1 ${
                                pembayaran.status === "UNPAID"
                                  ? "btn-success"
                                  : "btn-danger"
                              }`}
                            >
                              {pembayaran.status === "UNPAID"
                                ? "Approve"
                                : "Disapprove"}
                            </button>
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

export default PembayaranPage;
