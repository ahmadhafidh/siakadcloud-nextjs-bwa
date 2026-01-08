"use client";
import React from "react";
import api from "@/app/lib/axiosInstance";
import Select from "react-select";
import { useEffect, useState, useMemo } from "react";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { BarLoader } from "react-spinners";
import { AxiosError } from "axios";

// Komponen reusable
import DataTable from "@/app/components/table/DataTable";
import TableToolbar from "@/app/components/table/TableToolbar";
import TablePagination from "@/app/components/table/TablePagination";

interface Fakultas {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}
interface Prodi {
  id: string;
  name: string;
  code: string;
  facultyId: string;
  faculty?: Fakultas;
  createdAt: string;
}

interface Dosen {
  faculty: Fakultas;
  id: string;
  name: string;
  email: string;
  lectureNumber: number;
  position: string;
  majorId: string;
  major?: Prodi & { faculty?: Fakultas };
  createdAt: string;
  updatedAt: string;
}

// API Services
const getProdi = async () => {
  const res = await api.get("/majors");
  return res.data.data;
};
const getDosen = async () => {
  const res = await api.get("/lectures");
  return res.data.data;
};
const addDosen = async (data: {
  name: string;
  email: string;
  lectureNumber: number;
  position: string;
  majorId: string;
}) => {
  const res = await api.post("/lectures", data);
  return res.data;
};
const updateDosen = async (
  id: string,
  data: {
    name?: string;
    email: string;
    lectureNumber: number;
    position: string;
    majorId: string;
  }
) => {
  const res = await api.put(`/lectures/${id}`, data);
  return res.data;
};
const deleteProdi = async (id: string) => {
  const res = await api.delete(`/lectures/${id}`);
  return res.data;
};

const DosenPage = () => {
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDosen, setSelectedDosen] = useState<Partial<Dosen>>({});
  const [newDosen, setNewDosen] = useState({
    name: "",
    email: "",
    lectureNumber: 0,
    position: "",
    majorId: "",
  });
  const [prodiList, setProdiList] = useState<Prodi[]>([]);
  const [dosenList, setDosenList] = useState<Dosen[]>([]);

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
        await fetchDosen();
        await fetchProdi();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const fetchDosen = async () => {
    try {
      const data = await getDosen();
      const sortedData = data.sort((a: Fakultas, b: Fakultas) =>
        a.name.localeCompare(b.name, "id", { sensitivity: "base" })
      );

      setDosenList(sortedData);
    } catch (err) {
      console.error("Gagal fetch dosen:", err);
    }
  };

  const fetchProdi = async () => {
    try {
      const data = await getProdi();
      const sortedData = data.sort((a: Fakultas, b: Fakultas) =>
        a.name.localeCompare(b.name, "id", { sensitivity: "base" })
      );

      setProdiList(sortedData);
    } catch (err) {
      console.error("Gagal fetch prodi:", err);
    }
  };

  const openEditModal = (dosen: Dosen) => {
    setSelectedDosen(dosen);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedDosen({});
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSelectedDosen((prev) => ({
      ...prev,
      [name]: name === "lectureNumber" ? Number(value) : value,
    }));
  };

  const handleNewDosenChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewDosen((prev) => ({
      ...prev,
      [name]: name === "lectureNumber" ? Number(value) : value,
    }));
  };

  const handleAddNewDosen = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const saved = await addDosen(newDosen);
      setDosenList((prev) => [...prev, saved]);
      setNewDosen({
        name: "",
        email: "",
        lectureNumber: 0,
        position: "",
        majorId: "",
      });
      fetchDosen();
    } catch (err) {
      console.error("Gagal tambah dosen:", err);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedDosen.id) return;

    try {
      const updated = await updateDosen(selectedDosen.id, {
        name: selectedDosen.name ?? "",
        email: selectedDosen.email ?? "",
        lectureNumber: selectedDosen.lectureNumber ?? 0,
        position: selectedDosen.position ?? "",
        majorId: selectedDosen.majorId ?? "",
      });

      setDosenList((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      closeEditModal();
      fetchDosen();
    } catch (err) {
      console.error("Gagal update dosen:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus dosen ini?")) return;

    try {
      await deleteProdi(id);
      setDosenList((prev) => prev.filter((d) => d.id !== id));
      alert("Dosen berhasil dihapus!");
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
  const columns = useMemo<ColumnDef<Dosen>[]>(
    () => [
      {
        accessorFn: (row, index) => index + 1,
        header: "#",
      },
      { accessorKey: "name", header: "Name" },
      { accessorKey: "email", header: "Email" },
      { accessorFn: (row) => row.major?.faculty?.name, header: "Fakultas" },
      { accessorFn: (row) => row.major?.name, header: "Program Studi" },
      { accessorKey: "lectureNumber", header: "NIP" },
      { accessorKey: "position", header: "Jabatan" },
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
    data: dosenList,
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
              <a href="../pengguna/dosen.html">Dosen</a>
            </div>
          </div>
        </div>

        <div className="section-body">
          <h2 className="section-title">Dosen</h2>
          <p className="section-lead">
            Menampilkan semua data Dosen yang ada pada universitas ini
          </p>
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <button
                    className="btn btn-primary btn-sm footer-left mb-2"
                    type="button"
                    data-toggle="collapse"
                    data-target="#collapseEditDosen"
                  >
                    Tambah Dosen
                  </button>
                  <div className="collapse" id="collapseEditDosen">
                    <div className="card card-body">
                      <form onSubmit={handleAddNewDosen} method="POST">
                        <div className="row">
                          <div className="form-group col-md-6">
                            <label>Nama</label>
                            <input
                              type="text"
                              className="form-control"
                              name="name"
                              placeholder="Nama Dosen"
                              value={newDosen.name}
                              onChange={handleNewDosenChange}
                            />
                          </div>
                          <div className="form-group col-md-6">
                            <label>Email</label>
                            <input
                              type="email"
                              className="form-control"
                              name="email"
                              placeholder="Email Dosen"
                              value={newDosen.email}
                              onChange={handleNewDosenChange}
                            />
                          </div>
                          <div className="form-group col-md-6">
                            <label>Program Studi</label>
                            <Select
                              instanceId="majorId"
                              name="majorId"
                              value={
                                prodiList
                                  .map((f) => ({ label: f.name, value: f.id }))
                                  .find(
                                    (opt) => opt.value === newDosen.majorId
                                  ) || null
                              }
                              onChange={(opt) =>
                                setNewDosen((prev) => ({
                                  ...prev,
                                  majorId:
                                    (opt as { label: string; value: string })
                                      ?.value || "",
                                }))
                              }
                              options={prodiList.map((f) => ({
                                label: `${f.name} (${f.faculty?.name})`,
                                value: f.id,
                              }))}
                              placeholder="Pilih Program Studi"
                              isClearable
                            />
                          </div>
                          <div className="form-group col-md-6">
                            <label>NIP</label>
                            <input
                              type="number"
                              className="form-control"
                              name="lectureNumber"
                              placeholder="NIP"
                              value={newDosen.lectureNumber}
                              onChange={handleNewDosenChange}
                            />
                          </div>
                          <div className="form-group col-md-3">
                            <label>Jabatan</label>
                            <input
                              type="text"
                              className="form-control"
                              name="position"
                              placeholder="Jabatan"
                              value={newDosen.position}
                              onChange={handleNewDosenChange}
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
                            data-target="#collapseEditDosen"
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
                  <h5 className="modal-title">Edit Program Dosen</h5>
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
                    <label>Nama Dosen</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={selectedDosen.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Dosen</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={selectedDosen.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Program studi</label>
                    <Select
                      instanceId="majorId"
                      name="majorId"
                      value={
                        selectedDosen.majorId
                          ? {
                              value: selectedDosen.majorId,
                              label:
                                prodiList.find(
                                  (k) => k.id === selectedDosen.majorId
                                )?.name +
                                " (" +
                                prodiList.find(
                                  (k) => k.id === selectedDosen.majorId
                                )?.faculty?.name +
                                ")",
                            }
                          : null
                      }
                      onChange={(option) =>
                        setSelectedDosen((prev) => ({
                          ...prev,
                          majorId: option?.value ?? "",
                        }))
                      }
                      options={prodiList.map((k) => ({
                        value: k.id,
                        label: `${k.name} (${k.faculty?.name})`,
                      }))}
                      placeholder="Pilih Program Studi"
                      isClearable
                    />
                  </div>
                  <div className="form-group">
                    <label>NIP</label>
                    <input
                      type="number"
                      name="lectureNumber"
                      className="form-control"
                      value={selectedDosen.lectureNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Jabatan</label>
                    <input
                      type="text"
                      name="position"
                      className="form-control"
                      value={selectedDosen.position}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-danger"
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

export default DosenPage;
