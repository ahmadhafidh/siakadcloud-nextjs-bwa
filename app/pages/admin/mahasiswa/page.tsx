"use client";
import React, { useState, useMemo, useEffect } from "react";
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
import Select from "react-select";
import { BarLoader } from "react-spinners";
import { AxiosError } from "axios";

// Komponen reusable
import DataTable from "@/app/components/table/DataTable";
import TableToolbar from "@/app/components/table/TableToolbar";
import TablePagination from "@/app/components/table/TablePagination";
import PasswordStatus from "@/app/components/PasswordStatus";

interface Mahasiswa {
  id: string;
  name: string;
  email: string;
  studentNumber: string;
  semester: number;
  password: string;
  classOf: number;
  tfGroupId: string;
  tfGroup?: GolUkt;
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

interface GolUkt {
  id: string;
  group: string;
}

interface Kelas {
  id: string;
  name: string;
  major: Prodi;
}

// API Services
const getGolUkt = async () => {
  const res = await api.get("/tf-groups");
  return res.data.data;
};
const getKelas = async () => {
  const res = await api.get("/classes");
  return res.data.data;
};
const getMahasiswa = async () => {
  const res = await api.get("/students");
  return res.data.data;
};
const addMahasiswa = async (data: {
  name: string;
  email: string;
  semester: number;
  classOf: number;
  tfGroupId: string;
  classId: string;
}) => {
  const res = await api.post("/students", data);
  return res.data;
};
const updateMahasiswa = async (
  id: string,
  data: {
    name: string;
    email: string;
    semester: number;
    classOf: number;
    tfGroupId: string;
    classId: string;
  }
) => {
  const res = await api.put(`/students/${id}`, data);
  return res.data;
};
const deleteMahasiswa = async (id: string) => {
  const res = await api.delete(`/students/${id}`);
  return res.data;
};

const MahasiswaPage = () => {
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState<
    Partial<Mahasiswa>
  >({});
  const [newMahasiswa, setNewMahasiswa] = useState({
    name: "",
    email: "",
    semester: 0,
    classOf: 0,
    tfGroupId: "",
    classId: "",
  });
  const [mahasiswaList, setMahasiswaList] = useState<Mahasiswa[]>([]);
  const [golUktList, setGolUktList] = useState<GolUkt[]>([]);
  const [kelasList, setKelasList] = useState<Kelas[]>([]);

  // State untuk search, sorting, pagination
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // ambil data awal
  useEffect(() => {
    const fetchAll = async () => {
      try {
        await fetchGolUkt();
        await fetchKelas();
        await fetchMahasiswa();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const fetchGolUkt = async () => {
    try {
      const data = await getGolUkt();
      const sortedData = data.sort((a: GolUkt, b: GolUkt) =>
        a.group.localeCompare(b.group, "id", {
          numeric: true,
          sensitivity: "base",
        })
      );
      setGolUktList(sortedData);
    } catch (err) {
      console.error("Gagal fetch prodi:", err);
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
      console.error("Gagal fetch tahun ajaran:", err);
    }
  };

  const fetchMahasiswa = async () => {
    try {
      const data = await getMahasiswa();
      const sortedData = data.sort((a: Mahasiswa, b: Mahasiswa) =>
        a.name.localeCompare(b.name, "id", { sensitivity: "base" })
      );
      setMahasiswaList(sortedData);
    } catch (err) {
      console.error("Gagal fetch mahasiswa:", err);
    }
  };

  const openEditModal = (mahasiswa: Mahasiswa) => {
    setSelectedMahasiswa(mahasiswa);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedMahasiswa({});
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSelectedMahasiswa((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewMahasiswaChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewMahasiswa((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNewMahasiswa = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const saved = await addMahasiswa(newMahasiswa);
      setMahasiswaList((prev) => [...prev, saved]);
      setNewMahasiswa({
        name: "",
        email: "",
        semester: 0,
        classOf: 0,
        tfGroupId: "",
        classId: "",
      });
      fetchMahasiswa();
    } catch (err) {
      console.error("Gagal tambah mahasiswa:", err);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedMahasiswa.id) return;

    try {
      const updated = await updateMahasiswa(selectedMahasiswa.id, {
        name: selectedMahasiswa.name ?? "",
        email: selectedMahasiswa.email ?? "",
        semester: selectedMahasiswa.semester ?? 0,
        classOf: selectedMahasiswa.classOf ?? 0,
        tfGroupId: selectedMahasiswa.tfGroupId ?? "",
        classId: selectedMahasiswa.classId ?? "",
      });

      setMahasiswaList((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      closeEditModal();
      fetchMahasiswa();
    } catch (err) {
      console.error("Gagal update mahasiswa:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus mahasiswa ini?")) return;

    try {
      await deleteMahasiswa(id);
      setMahasiswaList((prev) => prev.filter((p) => p.id !== id));
      alert("Mahasiswa berhasil dihapus!");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        if (
          err.response?.data?.data?.error?.includes("Foreign key constraint")
        ) {
          alert("Data tidak bisa dihapus karena masih memiliki data terkait.");
        } else {
          alert("Gagal hapus: " + err.message);
        }
        console.error("Gagal hapus:", err);
      } else if (err instanceof Error) {
        // fallback jika bukan AxiosError tapi Error biasa
        alert("Gagal hapus: " + err.message);
        console.error("Gagal hapus:", err);
      } else {
        // fallback unknown error
        console.error("Unknown error:", err);
        alert("Gagal hapus: Terjadi kesalahan yang tidak diketahui");
      }
    }
  };

  // Columns untuk tabel
  const columns = useMemo<ColumnDef<Mahasiswa>[]>(
    () => [
      {
        accessorFn: (row, index) => index + 1,
        header: "#",
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
          const hasNoPassword = row.original.password === null;

          return (
            <div className="d-flex align-items-center">
              <PasswordStatus status={hasNoPassword ? "inactive" : "active"} />
              <span className="m-2">{row.original.name}</span>
            </div>
          );
        },
      },
      { accessorKey: "email", header: "Email" },
      {
        accessorFn: (row) => row.class?.major?.faculty?.name,
        header: "Fakultas",
      },
      { accessorFn: (row) => row.class?.major?.name, header: "Program Studi" },
      { accessorFn: (row) => row.class?.name, header: "Kelas" },
      { accessorFn: (row) => row.tfGroup?.group, header: "Golongan UKT" },
      { accessorFn: (row) => row.studentNumber, header: "NIM" },
      { accessorFn: (row) => row.semester, header: "Semester" },
      { accessorFn: (row) => row.classOf, header: "Angkatan" },
      {
        accessorKey: "createdAt",
        header: "Dibuat pada",
        cell: (info) =>
          new Date(info.getValue() as string).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
      },
      {
        header: "Aksi",
        cell: ({ row }) => {
          const mahasiswa = row.original;
          return (
            <>
              <a
                href="#"
                className="btn btn-icon btn-primary m-1"
                onClick={(e) => {
                  e.preventDefault();
                  openEditModal(mahasiswa);
                }}
              >
                <i className="far fa-edit"></i>
              </a>
              <a
                href="#"
                className="btn btn-icon btn-danger"
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete(mahasiswa.id);
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
    data: mahasiswaList,
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
          <h1>Pengguna</h1>
          <div className="section-header-breadcrumb">
            <div className="breadcrumb-item">Pengguna</div>
            <div className="breadcrumb-item">
              <a href="../pengguna/mahasiswa.html">Pengguna</a>
            </div>
          </div>
        </div>

        <div className="section-body">
          <h2 className="section-title">Mahasiswa</h2>
          <p className="section-lead">
            Menampilkan semua data Mahasiswa yang ada pada universitas ini
          </p>
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <button
                    className="btn btn-primary btn-sm footer-left mb-2"
                    type="button"
                    data-toggle="collapse"
                    data-target="#collapseEditMahasiswa"
                  >
                    Tambah Mahasiswa
                  </button>
                  <div className="collapse" id="collapseEditMahasiswa">
                    <div className="card card-body">
                      <form
                        action="#"
                        onSubmit={handleAddNewMahasiswa}
                        method="POST"
                      >
                        <div className="row">
                          <div className="form-group col-md-6">
                            <label>Nama</label>
                            <input
                              type="text"
                              className="form-control"
                              name="name"
                              placeholder="Nama"
                              value={newMahasiswa.name} // pakai newProdi
                              onChange={handleNewMahasiswaChange}
                              required
                            />
                          </div>
                          <div className="form-group col-md-6">
                            <label>Email</label>
                            <input
                              type="email"
                              className="form-control"
                              name="email"
                              placeholder="Email"
                              value={newMahasiswa.email} // pakai newProdi
                              onChange={handleNewMahasiswaChange}
                              required
                            />
                          </div>
                          <div className="form-group col-md-3">
                            <label>Semester</label>
                            <input
                              type="number"
                              className="form-control"
                              name="semester"
                              placeholder="Semester"
                              value={newMahasiswa.semester} // pakai newProdi
                              onChange={handleNewMahasiswaChange}
                              required
                            />
                          </div>
                          <div className="form-group col-md-3">
                            <label>Angkatan</label>
                            <input
                              type="number"
                              className="form-control"
                              name="classOf"
                              placeholder="Angkatan"
                              value={newMahasiswa.classOf} // pakai newProdi
                              onChange={handleNewMahasiswaChange}
                              required
                            />
                          </div>
                          <div className="form-group col-md-6">
                            <label>Golongan UKT</label>
                            <Select
                              instanceId="tfGroupId"
                              name="tfGroupId"
                              value={
                                golUktList
                                  .map((f) => ({ label: f.group, value: f.id }))
                                  .find(
                                    (opt) =>
                                      opt.value === newMahasiswa.tfGroupId
                                  ) || null
                              }
                              onChange={(opt) =>
                                setNewMahasiswa((prev) => ({
                                  ...prev,
                                  tfGroupId:
                                    (opt as { label: string; value: string })
                                      ?.value || "",
                                }))
                              }
                              options={golUktList.map((f) => ({
                                label: f.group,
                                value: f.id,
                              }))}
                              placeholder="Pilih Golongan UKT"
                              isClearable
                            />
                          </div>
                          <div className="form-group col-md-6">
                            <label>Nama Kelas</label>
                            <Select
                              instanceId="classId"
                              name="classId"
                              value={
                                kelasList
                                  .map((f) => ({ label: f.name, value: f.id }))
                                  .find(
                                    (opt) => opt.value === newMahasiswa.classId
                                  ) || null
                              }
                              onChange={(opt) =>
                                setNewMahasiswa((prev) => ({
                                  ...prev,
                                  classId:
                                    (opt as { label: string; value: string })
                                      ?.value || "",
                                }))
                              }
                              options={kelasList.map((f) => ({
                                label: `${f.name} (${f.major.name})`,
                                value: f.id,
                              }))}
                              placeholder="Pilih Kelas"
                              isClearable
                            />
                          </div>
                        </div>
                        <div className="mt-3">
                          <button type="submit" className="btn btn-primary">
                            Simpan Perubahan
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger m-2"
                            data-toggle="collapse"
                            data-target="#collapseEditMahasiswa"
                          >
                            Batal
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                  {loading ? (
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{ minHeight: "300px" }}
                    >
                      <BarLoader color="#6777ef" />
                    </div>
                  ) : (
                    <>
                      <TableToolbar
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                        pageSize={pagination.pageSize}
                        setPageSize={(size) =>
                          setPagination((old) => ({ ...old, pageSize: size }))
                        }
                      />
                      <DataTable table={table} />
                      <TablePagination table={table} />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {isEditModalOpen && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSave}>
                <div className="modal-header">
                  <h5 className="modal-title">Edit Program Mahasiswa</h5>
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
                      name="name"
                      className="form-control"
                      value={selectedMahasiswa.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Nama Dosen</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={selectedMahasiswa.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Semester</label>
                    <input
                      type="text"
                      name="semester"
                      className="form-control"
                      value={selectedMahasiswa.semester}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Angkatan</label>
                    <input
                      type="number"
                      name="classOf"
                      className="form-control"
                      value={selectedMahasiswa.classOf}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Nama Kelas</label>
                    <Select
                      instanceId="classId"
                      name="classId"
                      value={
                        selectedMahasiswa.classId
                          ? {
                              value: selectedMahasiswa.classId,
                              label:
                                kelasList.find(
                                  (k) => k.id === selectedMahasiswa.classId
                                )?.name +
                                " (" +
                                kelasList.find(
                                  (k) => k.id === selectedMahasiswa.classId
                                )?.major.name +
                                ")",
                            }
                          : null
                      }
                      onChange={(option) =>
                        setSelectedMahasiswa((prev) => ({
                          ...prev,
                          classId: option?.value ?? "",
                        }))
                      }
                      options={kelasList.map((k) => ({
                        value: k.id,
                        label: `${k.name} (${k.major.name})`,
                      }))}
                      placeholder="-- Pilih Kelas --"
                      isClearable
                    />
                  </div>
                  <div className="form-group">
                    <label>Golongan UKT</label>
                    <Select
                      instanceId="tfGroupId"
                      name="tfGroupId"
                      value={
                        selectedMahasiswa.tfGroupId
                          ? {
                              value: selectedMahasiswa.tfGroupId,
                              label: golUktList.find(
                                (g) => g.id === selectedMahasiswa.tfGroupId
                              )?.group,
                            }
                          : null
                      }
                      onChange={(option) =>
                        setSelectedMahasiswa((prev) => ({
                          ...prev,
                          tfGroupId: option?.value ?? "",
                        }))
                      }
                      options={golUktList.map((g) => ({
                        value: g.id,
                        label: g.group,
                      }))}
                      placeholder="-- Pilih Golongan UKT --"
                      isClearable
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
    </>
  );
};

export default MahasiswaPage;
