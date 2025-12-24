'use client';
import React, { useState, useEffect, use } from 'react';
import api from "@/app/lib/axiosInstance";

interface Jadwal {
  id: string;
  name: string;
  day: string;
  timeStart: string;
  timeEnd: string;
  createdAt: string;
  classId: string;
  courseId: string;
  class: Kelas;
  course: Matkul;
}

interface Kelas {
  id: string;
  name: string;
  year: TahunAjaran;
  major: Prodi;
}

interface TahunAjaran {
  id: string;
  name: string;
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

interface Matkul {
  id: string;
  name: string;
  lecture: Dosen;
}
interface Dosen {
  id: string;
  name: string;
}

// API Services
const getKelas = async () => {
  const res = await api.get("/classes");
  return res.data.data;
};
const getMatkul = async () => {
  const res = await api.get("/courses");
  return res.data.data;
};
const getJadwal = async () => {
  const res = await api.get("/schedules");
  return res.data.data;
};
const addJadwal = async (data: {
  timeStart: string;
  timeEnd: string;
  day: string;
  classId: string;
  courseId: string;
}) => {
  const res = await api.post("/schedules", data);
  return res.data;
};
const updateJadwal = async (
  id: string,
  data: {
    timeStart: string;
    timeEnd: string;
    day: string;
    classId: string;
    courseId: string;
  }
) => {
  const res = await api.put(`/schedules/${id}`, data);
  return res.data;
};
const deleteJadwal = async (id: string) => {
  const res = await api.delete(`/schedules/${id}`);
  return res.data;
};

const JadwalPage = () => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); //update
    const [selectedJadwal, setSelectedJadwal] = useState<Partial<Jadwal>>({}); //update
    const [newJadwal, setNewJadwal] = useState({
        timeStart: "",
        timeEnd: "",
        day: "",
        classId: "",
        courseId: "",
    }); //create
    const [jadwalList, setJadwalList] = useState<Jadwal[]>([]); //list
    const [kelasList, setKelasList] = useState<Kelas[]>([]); //list
    const [matkulList, setMatkulList] = useState<Matkul[]>([]);//list

    //get alldata / list data
    useEffect(() => {
        fetchMatkul()
        fetchKelas()
        fetchJadwal()
    })
 
    const fetchMatkul = async () => {
        try {
            const data = await getMatkul()
            setMatkulList(data)
        } catch (err) {
            console.error("Gagal fetch matkul:", err)    
        }
    }
    const fetchKelas = async () => {
        try {
            const data = await getKelas()
            setKelasList(data)
        } catch (err) {
            console.error("Gagal fetch kelas:", err)    
        }
    }
    const fetchJadwal = async () => {
        try {
            const data = await getJadwal()
            setJadwalList(data)
        } catch (err) {
            console.error("Gagal fetch jadwal:", err)    
        }
    }

    //start of create data
    const handleAddNewJadwal = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
        const payload = {
            ...newJadwal,
            timeStart: new Date(newJadwal.timeStart).toISOString(),
            timeEnd: new Date(newJadwal.timeEnd).toISOString(),
        };

        await addJadwal(payload);
        setNewJadwal({
            timeStart: "",
            timeEnd: "",
            day: "",
            classId: "",
            courseId: "",
        });
        fetchJadwal();
        } catch (err) {
        console.error("Gagal tambah jadwal:", err);
        }
    };
    const handleNewJadwalChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        if (name === "timeStart") {
        const date = new Date(value);
        // ambil nama hari dalam bahasa Indonesia
        const dayName = date.toLocaleDateString("id-ID", { weekday: "long" });

        setNewJadwal((prev) => ({
            ...prev,
            [name]: value,
            day: dayName, // otomatis isi field day
        }));
        } else {
            setNewJadwal((prev) => ({ ...prev, [name]: value }));
        }
    };
    //end of create data

    // start of delete data
    const handleDelete = async (id:string) => {
        if (!confirm("Yakin hapus jadwal ini?")) return;

        try {
            await deleteJadwal(id);
            setJadwalList((prev) => prev.filter((p) => p.id !== id));
            alert("Jadwal berhasil dihapus!");
        } catch (err: any) {
            // Cek apakah error karena foreign key constraint
            if (err.response?.data?.data?.error?.includes("Foreign key constraint")) {
                alert(
                "Jadwal tidak bisa dihapus karena masih memiliki data terkait (misal mahasiswa, jadwal, dll)."
                );
            } else {
                alert("Gagal hapus jadwal: " + err.message);
            }
            console.error("Gagal hapus jadwal:", err);
        }
    }
    // end of delete data

    //start of update data
    // 1. buka popup modal
    const openEditModal = (jadwal: Jadwal) => {
        setSelectedJadwal(jadwal);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedJadwal({});
    };

    // 2. cek apakah ada perubahan data di inputan / di select option
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setSelectedJadwal((prev) => {
        let updated = { ...prev, [name]: value };

        // Kalau timeStart berubah → otomatis set day
        if (name === "timeStart") {
            updated.day = getDayFromDate(value);
        }

        return updated;
        });
    };

    //3 save data
    // const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     if (!selectedJadwal.id) return;

    //     try {
    //     const updated = await updateJadwal(selectedJadwal.id, {
    //         timeStart: toISOStringWithTZ(selectedJadwal.timeStart) ?? "",
    //         timeEnd: toISOStringWithTZ(selectedJadwal.timeEnd) ?? "",
    //         day: selectedJadwal.day ?? "",
    //         classId: selectedJadwal.classId ?? "",
    //         courseId: selectedJadwal.courseId ?? "",
    //     });

    //     setJadwalList((prev) =>
    //         prev.map((p) => (p.id === updated.id ? updated : p))
    //     );
    //     closeEditModal();
    //     fetchJadwal();
    //     } catch (err) {
    //     console.error("Gagal update jadwal:", err);
    //     }
    // };


    //end of update data
    
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
            <p className="section-lead">Menampilkan semua data Jadwal yang ada pada universitas ini</p>
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
                            Tambah Jadwal
                        </button>
                        <div className="collapse" id="collapseEditMatkul">
                            <div className="card card-body">
                                <form onSubmit={handleAddNewJadwal}>
                                    <div className="form-group">
                                        <label htmlFor="fakultas">Kelas</label>
                                        <select
                                        className="form-control"
                                        name="classId"
                                        value={newJadwal.classId} // pakai newProdi
                                        onChange={handleNewJadwalChange}
                                        required
                                        >
                                            <option>-- Pilih Kelas --</option>
                                            {kelasList.map((f) => (
                                                <option key={f.id} value={f.id}>
                                                    {f.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="prodi">Mata Kuliah</label>
                                        <select
                                        className="form-control"
                                        name="courseId"
                                        value={newJadwal.courseId} // pakai newProdi
                                        onChange={handleNewJadwalChange}
                                        required
                                        >
                                        <option>-- Pilih Mata Kuliah --</option>
                                        {matkulList.map((f) => (
                                            <option key={f.id} value={f.id}>
                                                {f.name}
                                            </option>
                                        ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Tanggal dan Jam Mulai</label>
                                        <input
                                        type="datetime-local"
                                        className="form-control"
                                        name="timeStart"
                                        value={newJadwal.timeStart}
                                        onChange={handleNewJadwalChange}
                                        required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Tanggal dan Jam Berakhir</label>
                                        <input
                                        type="datetime-local"
                                        className="form-control"
                                        name="timeEnd"
                                        value={newJadwal.timeEnd} // pakai newProdi
                                        onChange={handleNewJadwalChange}
                                        required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Hari</label>
                                        <input
                                        type="text"
                                        className="form-control"
                                        name="day"
                                        value={newJadwal.day} // pakai newProdi
                                        onChange={handleNewJadwalChange}
                                        readOnly
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
                                <th>Fakultas</th>
                                <th>Program Studi</th>
                                <th>Mata Kuliah</th>
                                <th>Kelas</th>
                                <th>Dosen</th>
                                <th>Tahun Ajaran</th>
                                <th>Hari</th>
                                <th>Tanggal</th>
                                <th>Waktu Mulai</th>
                                <th>Waktu Berakhir</th>
                                <th>Dibuat Pada</th>
                                <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jadwalList.map((jadwal, index) => (
                                <tr key={jadwal.id}>
                                    <td>{index +1}</td>
                                    <td>{jadwal.class.major.faculty.name}</td>
                                    <td>{jadwal.class.major.name}</td>
                                    <td>{jadwal.course.name}</td>
                                    <td>{jadwal.class.name}</td>
                                    <td>{jadwal.course.lecture.name}</td>
                                    <td>{jadwal.class.year.name}</td>
                                    <td>{jadwal.day}</td>
                                        <td>
                                            {new Date(jadwal.timeStart).toLocaleDateString(
                                            "id-ID",
                                            {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            }
                                            )}
                                        </td>
                                        <td>
                                            {new Date(jadwal.timeStart).toLocaleTimeString(
                                            "id-ID",
                                            {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: false,
                                            }
                                            )}
                                        </td>
                                        <td>
                                            {new Date(jadwal.timeEnd).toLocaleTimeString(
                                            "id-ID",
                                            {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: false,
                                            }
                                            )}
                                        </td>
                                        <td>
                                            {new Date(jadwal.createdAt).toLocaleDateString(
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
                                                openEditModal(jadwal);
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
                                                handleDelete(jadwal.id!);
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

        {/* {isEditModalOpen && (
            <div
                className="modal fade show"
                style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                    <form onSubmit={handleSave}>
                        <div className="modal-header">
                        <h5 className="modal-title">Edit Jadwal</h5>
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
                            <select
                                className="form-control"
                                name="classId"
                                value={selectedJadwal.classId}
                                onChange={handleInputChange}
                                required
                            >
                            <option>-- Pilih Kelas --</option>
                            {kelasList.map((f) => (
                                <option key={f.id} value={f.id}>
                                {f.name}
                                </option>
                            ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="prodi">Mata Kuliah</label>
                            <select
                                className="form-control"
                                name="courseId"
                                value={selectedJadwal.courseId} // pakai newProdi
                                onChange={handleInputChange}
                                required
                            >
                            <option>-- Pilih Mata Kuliah --</option>
                            {matkulList.map((f) => (
                                <option key={f.id} value={f.id}>
                                {f.name}
                                </option>
                            ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Tanggal dan Jam Mulai</label>
                            <input
                                type="datetime-local"
                                className="form-control"
                                name="timeStart"
                                value={formatForDatetimeLocal(
                                    selectedJadwal.timeStart ?? ""
                                )}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Tanggal dan Jam Berakhir</label>
                            <input
                                type="datetime-local"
                                className="form-control"
                                name="timeEnd"
                                value={formatForDatetimeLocal(
                                    selectedJadwal.timeEnd ?? ""
                                )}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Hari</label>
                            <input
                                type="text"
                                className="form-control"
                                name="day"
                                value={selectedJadwal.day} // pakai newProdi
                                onChange={handleInputChange}
                                readOnly
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
        )} */}
    </section>
  );
};

export default JadwalPage;