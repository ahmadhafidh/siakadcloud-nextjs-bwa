"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
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
import { BarLoader } from "react-spinners";

// Komponen reusable
import DataTable from "@/app/components/table/DataTable";
import TableToolbar from "@/app/components/table/TableToolbar";
import TablePagination from "@/app/components/table/TablePagination";

interface TahunAjaran {
  id?: string; // bisa undefined saat baru ditambahkan
  name: string;
  dateStart: string;
  dateEnd: string;
  status: boolean;
  createdAt?: string;
}

const TahunAjaranPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TahunAjaran[]>([]);
  const [newTahun, setNewTahun] = useState<TahunAjaran>({
    name: "",
    dateStart: "",
    dateEnd: "",
    status: false,
  });
  const [selectedEdit, setSelectedEdit] = useState<TahunAjaran | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // State untuk search, sorting, pagination
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // ===== API CRUD =====
  const fetchData = async () => {
    try {
      const res = await api.get("/years");
      setData(res.data.data);
    } catch (err) {
      console.error("Gagal fetch data:", err);
    }
  };

  const addTahunAjaran = async (e: React.FormEvent) => {
    e.preventDefault();

    // Tambahkan sementara di UI dengan temporary id
    const tempId = Date.now().toString();
    const tempItem = {
      ...newTahun,
      id: tempId,
      createdAt: new Date().toLocaleDateString("id-ID"),
    };
    setData((prev) => [...prev, tempItem]);

    try {
      const res = await api.post("/years", newTahun);
      // Update item sementara dengan id dari backend
      setData((prev) =>
        prev.map((item) => (item.id === tempId ? res.data.data : item)),
      );
      setNewTahun({
        name: "",
        dateStart: "",
        dateEnd: "",
        status: false,
      });
    } catch (err) {
      console.error("Gagal tambah tahun ajaran:", err);
      // rollback jika error
      setData((prev) => prev.filter((item) => item.id !== tempId));
    }
  };

  const handleEdit = useCallback((item: TahunAjaran) => {
    setSelectedEdit({
      ...item,
      dateStart: formatDateForInput(item.dateStart),
      dateEnd: formatDateForInput(item.dateEnd),
    });
    setShowEditModal(true);
  }, []);

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEdit || selectedEdit.id === undefined) return;

    try {
      const res = await api.put(`/years/${selectedEdit.id}`, selectedEdit);
      setData((prev) =>
        prev.map((item) =>
          item.id === selectedEdit.id ? res.data.data : item,
        ),
      );
      setShowEditModal(false);
      setSelectedEdit(null);
    } catch (err) {
      console.error("Gagal update:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    if (!confirm("Yakin hapus Tahun Ajaran ini?")) return;

    try {
      await api.delete(`/years/${id}`);
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Gagal hapus:", err);
    }
  };

  const formatDateForInput = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // ambil data awal
  useEffect(() => {
    const fetchAll = async () => {
      try {
        await fetchData();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Columns untuk tabel
  const columns = useMemo<ColumnDef<TahunAjaran>[]>(
    () => [
      {
        accessorFn: (row, index) => index + 1,
        header: "#",
      },
      { accessorKey: "name", header: "Name" },
      {
        accessorKey: "dateStart",
        header: "Tanggal Mulai",
        cell: (info) =>
          new Date(info.getValue() as string).toLocaleDateString("id-ID", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
          }),
      },
      {
        accessorKey: "dateEnd",
        header: "Tanggal Berakhir",
        cell: (info) =>
          new Date(info.getValue() as string).toLocaleDateString("id-ID", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
          }),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const item = row.original; // dapatkan data asli baris
          return (
            <span
              className={`badge ${
                item.status ? "badge-success" : "badge-danger"
              }`}
            >
              {item.status ? "Aktif" : "Tidak"}
            </span>
          );
        },
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
          const tahunAjaran = row.original;
          return (
            <>
              <a
                href="#"
                className="btn btn-icon btn-primary m-1"
                onClick={(e) => {
                  e.preventDefault();
                  handleEdit(tahunAjaran);
                }}
              >
                <i className="far fa-edit"></i>
              </a>
              <a
                href="#"
                className="btn btn-icon btn-danger"
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete(tahunAjaran.id!);
                }}
              >
                <i className="fa fa-trash"></i>
              </a>
            </>
          );
        },
      },
    ],
    [handleEdit],
  );

  // Inisialisasi react-table
  const table = useReactTable({
    data: data,
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
          <h1>Master</h1>
          <div className="section-header-breadcrumb">
            <div className="breadcrumb-item">Master</div>
            <div className="breadcrumb-item">
              <a href="../master/tahun-ajaran.html">Tahun Ajaran</a>
            </div>
          </div>
        </div>

        <div className="section-body">
          <h2 className="section-title">Tahun Ajaran</h2>
          <p className="section-lead">
            Menampilkan semua data Tahun Ajaran yang ada pada universitas ini
          </p>
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <button
                    className="btn btn-primary btn-sm footer-left mb-2"
                    type="button"
                    data-toggle="collapse"
                    data-target="#collapseTambahTahunAjaran"
                    onClick={() => setShowAddForm(!showAddForm)}
                  >
                    Tambah Tahun Ajaran
                  </button>

                  <div className="collapse" id="collapseTambahTahunAjaran">
                    <div className="card card-body">
                      <form onSubmit={addTahunAjaran}>
                        <div className="form-group">
                          <label>Nama Tahun Ajaran</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Nama Tahun Ajaran"
                            value={newTahun.name} // pakai state newTahun
                            onChange={(e) =>
                              setNewTahun({ ...newTahun, name: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Tanggal Dimulai</label>
                          <input
                            type="date"
                            className="form-control"
                            value={newTahun.dateStart}
                            onChange={(e) =>
                              setNewTahun({
                                ...newTahun,
                                dateStart: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Tanggal Berakhir</label>
                          <input
                            type="date"
                            className="form-control"
                            value={newTahun.dateEnd} // pakai state newTahun
                            onChange={(e) =>
                              setNewTahun({
                                ...newTahun,
                                dateEnd: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Apakah Aktif</label>
                          <br />
                          <div className="custom-control custom-switch">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="isAktif"
                              name="is_aktif"
                              checked={newTahun.status}
                              onChange={(e) =>
                                setNewTahun({
                                  ...newTahun,
                                  status: e.target.checked,
                                })
                              }
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="isAktif"
                            >
                              Aktif
                            </label>
                          </div>
                        </div>
                        <button type="submit" className="btn btn-primary">
                          Simpan
                        </button>
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
      {/* Modal Edit */}
      {showEditModal && selectedEdit && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={saveEdit}>
                <div className="modal-header">
                  <h5 className="modal-title">Edit Tahun Ajaran</h5>
                  <button
                    type="button"
                    className="close"
                    onClick={() => setShowEditModal(false)}
                  >
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Nama Tahun Ajaran</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedEdit.name}
                      onChange={(e) =>
                        setSelectedEdit({
                          ...selectedEdit,
                          name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Tanggal Dimulai</label>
                    <input
                      type="date"
                      className="form-control"
                      value={selectedEdit.dateStart}
                      onChange={(e) =>
                        setSelectedEdit({
                          ...selectedEdit,
                          dateStart: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Tanggal Berakhir</label>
                    <input
                      type="date"
                      className="form-control"
                      value={selectedEdit.dateEnd}
                      onChange={(e) =>
                        setSelectedEdit({
                          ...selectedEdit,
                          dateEnd: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Aktif</label>
                    <input
                      type="checkbox"
                      checked={selectedEdit.status}
                      onChange={(e) =>
                        setSelectedEdit({
                          ...selectedEdit,
                          status: e.target.checked,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => setShowEditModal(false)}
                  >
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Simpan Perubahan
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

export default TahunAjaranPage;
