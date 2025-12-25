"use client";
import React, { useState, useEffect } from "react";
import MyBarChart from "../../../components/myBarChart";
import api from "@/app/lib/axiosInstance";
import { time } from "console";

interface TimeLine {
  id: string;
  name: string;
  date: string;
  createdAt: string;
}

// API Services
const getTimeLine = async () => {
  const res = await api.get("/time-line");
  return res.data.data;
};
const addTimeLine = async (data: { name?: string; date?: string }) => {
  const res = await api.post("/time-line", data);
  return res.data;
};
const updateTimeLine = async (
  id: string,
  data: {
    name?: string;
    date?: string;
  }
) => {
  const res = await api.put(`/time-line/${id}`, data);
  return res.data;
};
const deleteTimeLine = async (id: string) => {
  const res = await api.delete(`/time-line/${id}`);
  return res.data;
};

const JadwalPage = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTimeLine, setSelectedTimeLine] = useState<Partial<TimeLine>>(
    {}
  );
  const [newTimeLine, setNewTimeLine] = useState({
    name: "",
    date: "",
  });
  const [timeLineList, setTimeLineList] = useState<TimeLine[]>([]);

  // ambil data awal
  useEffect(() => {
    fetchTimeLine();
  }, []);

  const fetchTimeLine = async () => {
    try {
      const data = await getTimeLine();
      setTimeLineList(data);
    } catch (err) {
      console.error("Gagal fetch timeLine:", err);
    }
  };

  const openEditModal = (timeLine: TimeLine) => {
    setSelectedTimeLine(timeLine);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTimeLine({});
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSelectedTimeLine((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewTimeLineChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewTimeLine((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNewTimeLine = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const saved = await addTimeLine(newTimeLine);
      setTimeLineList((prev) => [...prev, saved]);
      setNewTimeLine({ name: "", date: "" });
      fetchTimeLine();
    } catch (err) {
      console.error("Gagal tambah timeLine:", err);
    }
  };

  function formatDateForInput(isoString?: string) {
    if (!isoString) return "";
    return new Date(isoString).toISOString().slice(0, 10); // ambil YYYY-MM-DD
  }

  function formatForDatetimeLocal(isoString?: string) {
    if (!isoString) return "";
    const date = new Date(isoString);
    const offset = date.getTimezoneOffset(); // selisih menit
    const local = new Date(date.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
  }

  function toISOStringWithTZ(value: string | undefined) {
    if (!value) return undefined;
    const date = new Date(value); // "2025-08-06T08:00" jadi Date lokal
    return date.toISOString(); // => "2025-08-06T01:00:00.000Z"
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTimeLine.id) return;

    try {
      const updated = await updateTimeLine(selectedTimeLine.id, {
        name: selectedTimeLine.name ?? "",
        date: toISOStringWithTZ(selectedTimeLine.date) ?? "",
      });

      setTimeLineList((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      closeEditModal();
      fetchTimeLine();
    } catch (err) {
      console.error("Gagal update timeLine:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus jadwal ini?")) return;

    try {
      await deleteTimeLine(id);
      setTimeLineList((prev) => prev.filter((p) => p.id !== id));
      alert("TimeLine berhasil dihapus!");
    } catch (err: any) {
      // Cek apakah error karena foreign key constraint
      if (err.response?.data?.data?.error?.includes("Foreign key constraint")) {
        alert(
          "TimeLine tidak bisa dihapus karena masih memiliki data terkait (misal mahasiswa, jadwal, dll)."
        );
      } else {
        alert("Gagal hapus timeLine: " + err.message);
      }
      console.error("Gagal hapus timeLine:", err);
    }
  };

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
        <p className="section-lead">
          Menampilkan semua data Jadwal yang ada pada universitas ini
        </p>
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
                  Tambah Timeline
                </button>
                <div className="collapse" id="collapseEditMatkul">
                  <div className="card card-body">
                    <form onSubmit={handleAddNewTimeLine}>
                      <div className="form-group">
                        <label>Nama Timeline</label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          placeholder="Nama Timeline"
                          value={newTimeLine.name}
                          onChange={handleNewTimeLineChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Tanggal Timeline</label>
                        <input
                          type="date"
                          className="form-control"
                          name="date"
                          value={newTimeLine.date}
                          onChange={handleNewTimeLineChange}
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
                        <th>Nama Timeline</th>
                        <th>Tanggal</th>
                        <th>Dibuat pada</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {timeLineList.map((timeLine, index) => (
                        <tr key={timeLine.id}>
                          <td>{index + 1}</td>
                          <td>{timeLine.name}</td>
                          <td>
                            {new Date(timeLine.date).toLocaleDateString(
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
                            {new Date(timeLine.createdAt).toLocaleDateString(
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
                                openEditModal(timeLine);
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
                                handleDelete(timeLine.id!);
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
                  <h5 className="modal-title">Edit Timeline</h5>
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
                    <label htmlFor="fakultas">Kelas</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      placeholder="Nama Timeline"
                      value={selectedTimeLine.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Tanggal Timeline</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date"
                      value={formatDateForInput(selectedTimeLine.date)}
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

export default JadwalPage;
