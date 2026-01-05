"use client";
import React, { useState, useEffect, useMemo } from "react";
import MyBarChart from "../../../components/myBarChart";
import api from "@/app/lib/axiosInstance";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

// Komponen reusable
import DataTable from "@/app/components/table/DataTable";
import TableToolbar from "@/app/components/table/TableToolbar";
import TablePagination from "@/app/components/table/TablePagination";
import ModalEditForm from "@/app/components/form/EditForm";
import AddForm from "@/app/components/form/AddForm";

interface Jadwal {
  id: string;
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

interface Option {
  label: string;
  value: string;
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
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedJadwal, setSelectedJadwal] = useState<Partial<Jadwal>>({});
  const [newJadwal, setNewJadwal] = useState({
    timeStart: "",
    timeEnd: "",
    day: "",
    classId: "",
    courseId: "",
  });
  const [jadwalList, setJadwalList] = useState<Jadwal[]>([]);
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [matkulList, setMatkulList] = useState<Matkul[]>([]);

  // State untuk search, sorting, pagination
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "timeStart", desc: false },
  ]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // ambil data awal
  useEffect(() => {
    fetchMatkul();
    fetchKelas();
    fetchJadwal();
  }, []);

  const fetchMatkul = async () => {
    try {
      const data = await getMatkul();
      const sortedData = data.sort((a: Matkul, b: Matkul) =>
        a.name.localeCompare(b.name, "id", { sensitivity: "base" })
      );

      setMatkulList(sortedData);
    } catch (err) {
      console.error("Gagal fetch matkul:", err);
    }
  };

  const fetchKelas = async () => {
    try {
      const data = await getKelas();
      const sortedData = data.sort((a: Kelas, b: Kelas) =>
        a.name.localeCompare(b.name, "id", { sensitivity: "base" })
      );

      setKelasList(sortedData);
    } catch (err) {
      console.error("Gagal fetch Kelas:", err);
    }
  };

  const fetchJadwal = async () => {
    try {
      const data = await getJadwal();
      const sortedData = data.sort((a: Jadwal, b: Jadwal) =>
        a.timeStart.localeCompare(b.timeStart, "id", { sensitivity: "base" })
      );
      setJadwalList(sortedData);
    } catch (err) {
      console.error("Gagal fetch jadwal:", err);
    }
  };

  const openEditModal = (jadwal: Jadwal) => {
    setSelectedJadwal(jadwal);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedJadwal({});
  };

  const handleInputChange = (field: string, value: string | number) => {
    setSelectedJadwal((prev) => {
      let updated = { ...prev, [field]: value };
      console.log(updated);
      // Kalau timeStart berubah → otomatis set day
      if (field === "timeStart") {
        updated.day = getDayFromDate(String(value));
      }
      return updated;
    });
  };

  // const handleNewJadwalChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  // ) => {
  //   const { name, value } = e.target;

  //   if (name === "timeStart") {
  //     const date = new Date(value);
  //     // ambil nama hari dalam bahasa Indonesia
  //     const dayName = date.toLocaleDateString("id-ID", { weekday: "long" });

  //     setNewJadwal((prev) => ({
  //       ...prev,
  //       [name]: value,
  //       day: dayName, // otomatis isi field day
  //     }));
  //   } else {
  //     setNewJadwal((prev) => ({ ...prev, [name]: value }));
  //   }
  // };

  const handleNewJadwalChange2 = (name: string, value: string) => {
    if (name === "timeStart") {
      const date = new Date(value);
      const dayName = date.toLocaleDateString("id-ID", { weekday: "long" });

      setNewJadwal((prev) => ({
        ...prev,
        [name]: value,
        day: dayName,
      }));
    } else {
      setNewJadwal((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddNewJadwal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload = {
        ...newJadwal,
        timeStart: new Date(newJadwal.timeStart).toISOString(),
        timeEnd: new Date(newJadwal.timeEnd).toISOString(),
      };

      await addJadwal(payload);
      fetchJadwal();
      setNewJadwal({
        timeStart: "",
        timeEnd: "",
        day: "",
        classId: "",
        courseId: "",
      });
    } catch (err) {
      console.error("Gagal tambah jadwal:", err);
    }
  };

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

  function getDayFromDate(value: string | undefined) {
    if (!value) return "";
    const date = new Date(value);
    return date.toLocaleDateString("id-ID", { weekday: "long" });
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedJadwal.id) return;

    try {
      const updated = await updateJadwal(selectedJadwal.id, {
        timeStart: toISOStringWithTZ(selectedJadwal.timeStart) ?? "",
        timeEnd: toISOStringWithTZ(selectedJadwal.timeEnd) ?? "",
        day: selectedJadwal.day ?? "",
        classId: selectedJadwal.classId ?? "",
        courseId: selectedJadwal.courseId ?? "",
      });

      setJadwalList((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      closeEditModal();
      fetchJadwal();
    } catch (err) {
      console.error("Gagal update jadwal:", err);
    }
  };

  const handleDelete = async (id: string) => {
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
  };

  // Columns untuk tabel
  const columns = useMemo<ColumnDef<Jadwal>[]>(
    () => [
      {
        accessorFn: (row, index) => index + 1,
        header: "#",
      },
      {
        accessorFn: (row) => row.class?.major?.faculty?.name,
        header: "Fakultas",
      },
      { accessorFn: (row) => row.class?.major?.name, header: "Program Studi" },
      { accessorFn: (row) => row.course?.name, header: "Mata Kuliah" },
      { accessorFn: (row) => row.class?.name, header: "Kelas" },
      { accessorFn: (row) => row.course?.lecture?.name, header: "Dosen" },
      { accessorFn: (row) => row.class?.year?.name, header: "Tahun Ajaran" },
      { accessorKey: "day", header: "Hari" },
      {
        accessorKey: "timeStart",
        header: "Tanggal",
        cell: (info) =>
          new Date(info.getValue() as string).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
      },
      {
        id: "timeStartHour",
        accessorFn: (row) => row.timeStart,
        header: "Waktu Mulai",
        cell: (info) =>
          new Date(info.getValue() as string).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
      },
      {
        accessorKey: "timeEnd",
        header: "Waktu Berakhir",
        cell: (info) =>
          new Date(info.getValue() as string).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
      },
      {
        accessorKey: "createdAt",
        header: "Dibuat pada",
        cell: (info) =>
          new Date(info.getValue() as string).toLocaleDateString("id-ID", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
          }),
      },
      {
        header: "Aksi",
        cell: ({ row }) => {
          const prodi = row.original;
          return (
            <>
              <a
                href="#"
                className="btn btn-icon btn-primary m-1"
                onClick={(e) => {
                  e.preventDefault();
                  openEditModal(prodi);
                }}
              >
                <i className="far fa-edit"></i>
              </a>
              <a
                href="#"
                className="btn btn-icon btn-danger"
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete(prodi.id);
                }}
              >
                <i className="fa fa-trash"></i>
              </a>
            </>
          );
        },
      },
    ],
    []
  );

  // Inisialisasi react-table
  const table = useReactTable({
    data: jadwalList,
    columns,
    state: { pagination, globalFilter, sorting },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <>
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
                    Tambah Jadwal
                  </button>
                  <div className="collapse" id="collapseEditMatkul">
                    <div className="card card-body">
                      {/* Add Form */}
                      <AddForm
                        onSubmit={handleAddNewJadwal}
                        collapseTargetId="collapseEditMatkul"
                        fields={[
                          {
                            label: "Nama Kelas",
                            name: "classId",
                            type: "asyncSelect",
                            placeholder: "Pilih Kelas",
                            value: newJadwal.classId,
                            onChange: (opt: any) =>
                              handleNewJadwalChange2(
                                "classId",
                                opt ? opt.value : ""
                              ),
                            options: kelasList.map((f) => ({
                              label: f.name,
                              value: f.id,
                            })),
                            loadOptions: async (inputValue: string) => {
                              // bisa filter dari fakultasList lokal
                              return kelasList
                                .filter((f) =>
                                  f.name
                                    .toLowerCase()
                                    .includes(inputValue.toLowerCase())
                                )
                                .map((f) => ({ label: f.name, value: f.id }));
                            },
                          },
                          {
                            label: "Nama Mata Kuliah",
                            name: "courseId",
                            type: "asyncSelect",
                            placeholder: "Pilih Mata Kuliah",
                            value: newJadwal.courseId,
                            onChange: (opt: any) =>
                              handleNewJadwalChange2(
                                "courseId",
                                opt ? opt.value : ""
                              ),
                            options: matkulList.map((f) => ({
                              label: f.name,
                              value: f.id,
                            })),
                            loadOptions: async (inputValue: string) => {
                              // bisa filter dari fakultasList lokal
                              return matkulList
                                .filter((f) =>
                                  f.name
                                    .toLowerCase()
                                    .includes(inputValue.toLowerCase())
                                )
                                .map((f) => ({ label: f.name, value: f.id }));
                            },
                          },
                          {
                            label: "Tanggal dan Jam Mulai",
                            name: "timeStart",
                            type: "datetime-local",
                            value: newJadwal?.timeStart,
                            onChange: (e: any) =>
                              handleNewJadwalChange2(
                                "timeStart",
                                e.target.value
                              ),
                          },
                          {
                            label: "Tanggal dan Jam Berakhir",
                            name: "timeEnd",
                            type: "datetime-local",
                            value: newJadwal?.timeEnd,
                            onChange: (e: any) =>
                              handleNewJadwalChange2("timeEnd", e.target.value),
                          },
                          {
                            label: "Hari",
                            name: "day",
                            type: "text",
                            value: newJadwal?.day,
                            onChange: (e: any) =>
                              handleNewJadwalChange2("day", e.target.value),
                            disabled: true,
                          },
                        ]}
                      />
                    </div>
                  </div>
                  <div className="table-responsive">
                    {/* Toolbar (Search + Page Size) */}
                    <TableToolbar
                      globalFilter={globalFilter}
                      setGlobalFilter={setGlobalFilter}
                      pageSize={pagination.pageSize}
                      setPageSize={(size) =>
                        setPagination((old) => ({ ...old, pageSize: size }))
                      }
                    />

                    {/* Tabel */}
                    <DataTable table={table} />

                    {/* Pagination */}
                    <TablePagination table={table} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Edit Form */}
      <ModalEditForm
        title="Edit Program Studi"
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSubmit={handleSave}
        fields={[
          {
            label: "Nama Kelas",
            name: "classId",
            type: "asyncSelect",
            placeholder: "Masukkan Nama Kelas",
            value: selectedJadwal.classId ?? "",
            onChange: (opt) =>
              setSelectedJadwal((prev) => ({
                ...prev,
                classId: (opt as Option)?.value || "", // simpan id
              })),
            options: kelasList.map((f) => ({ label: f.name, value: f.id })),
            loadOptions: async (inputValue: string) => {
              // bisa filter dari fakultasList lokal
              return kelasList
                .filter((f) =>
                  f.name.toLowerCase().includes(inputValue.toLowerCase())
                )
                .map((f) => ({ label: f.name, value: f.id }));
            },
          },
          {
            label: "Nama Mata Kuliah",
            name: "courseId",
            type: "asyncSelect",
            placeholder: "Masukkan Nama Mata Kuliah",
            value: selectedJadwal.courseId ?? "",
            onChange: (opt) =>
              setSelectedJadwal((prev) => ({
                ...prev,
                courseId: (opt as Option)?.value || "", // simpan id
              })),
            options: matkulList.map((f) => ({ label: f.name, value: f.id })),
            loadOptions: async (inputValue: string) => {
              // bisa filter dari fakultasList lokal
              return matkulList
                .filter((f) =>
                  f.name.toLowerCase().includes(inputValue.toLowerCase())
                )
                .map((f) => ({ label: f.name, value: f.id }));
            },
          },
          {
            label: "Tanggal dan Waktu Mulai",
            name: "timeStart",
            type: "datetime-local",
            value: formatForDatetimeLocal(selectedJadwal.timeStart ?? ""),
            onChange: (e) => {
              if (e && "target" in e) {
                handleInputChange("timeStart", e.target.value);
              }
            },
          },
          {
            label: "Tanggal dan Waktu Berakhir",
            name: "timeEnd",
            type: "datetime-local",
            value: formatForDatetimeLocal(selectedJadwal.timeEnd ?? ""),
            onChange: (e) => {
              if (e && "target" in e) {
                setSelectedJadwal((prev) => ({
                  ...prev,
                  timeEnd: e.target.value, // aman
                }));
              }
            },
          },
          {
            label: "Hari",
            name: "day",
            type: "text",
            value: selectedJadwal.day ?? "",
            disabled: true,
            onChange: (e: any) => handleInputChange("day", e.target.value),
          },
        ]}
        submitText="Simpan"
        cancelText="Batal"
      />

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
    </>
  );
};

export default JadwalPage;
