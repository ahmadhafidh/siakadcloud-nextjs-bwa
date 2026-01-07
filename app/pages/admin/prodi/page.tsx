"use client";
import api from "@/app/lib/axiosInstance";
import React, { useEffect, useMemo, useState } from "react";
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
import ModalEditForm from "@/app/components/form/EditForm";
import AddForm from "@/app/components/form/AddForm";

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
interface Option {
  label: string;
  value: string;
}

// API Services
const getProdi = async () => {
  const res = await api.get("/majors");
  return res.data.data;
};
const getFakultas = async () => {
  const res = await api.get("/faculties");
  return res.data.data;
};
const addProdi = async (data: {
  name: string;
  code: string;
  facultyId: string;
}) => {
  const res = await api.post("/majors", data);
  return res.data;
};
const updateProdi = async (
  id: string,
  data: { name?: string; code?: string; facultyId?: string }
) => {
  const res = await api.put(`/majors/${id}`, data);
  return res.data;
};
const deleteProdi = async (id: string) => {
  const res = await api.delete(`/majors/${id}`);
  return res.data;
};

const ProdiPage = () => {
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProdi, setSelectedProdi] = useState<Partial<Prodi>>({});
  const [newProdi, setNewProdi] = useState({
    name: "",
    code: "",
    facultyId: "",
  });
  const [prodiList, setProdiList] = useState<Prodi[]>([]);
  const [fakultasList, setFakultasList] = useState<Fakultas[]>([]);

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
        await fetchFakultas();
        await fetchProdi();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const fetchFakultas = async () => {
    try {
      const data = await getFakultas();
      const sortedData = data.sort((a: Fakultas, b: Fakultas) =>
        a.name.localeCompare(b.name, "id", { sensitivity: "base" })
      );
      setFakultasList(sortedData);
    } catch (err) {
      console.error("Gagal fetch fakultas:", err);
    }
  };

  const fetchProdi = async () => {
    try {
      const data = await getProdi();
      const sortedData = data.sort((a: Prodi, b: Prodi) =>
        a.name.localeCompare(b.name, "id", { sensitivity: "base" })
      );
      setProdiList(sortedData);
    } catch (err) {
      console.error("Gagal fetch prodi:", err);
    }
  };

  const openEditModal = (prodi: Prodi) => {
    setSelectedProdi(prodi);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProdi({});
  };

  const handleNewProdiChange = (name: string, value: string | boolean) => {
    setNewProdi((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProdi.id) return;

    try {
      const updated = await updateProdi(selectedProdi.id, {
        name: selectedProdi.name,
        code: selectedProdi.code,
        facultyId: selectedProdi.facultyId,
      });

      setProdiList((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      closeEditModal();
      fetchProdi();
    } catch (err) {
      console.error("Gagal update prodi:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus prodi ini?")) return;

    try {
      await deleteProdi(id);
      setProdiList((prev) => prev.filter((p) => p.id !== id));
      alert("Prodi berhasil dihapus!");
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
  const columns = useMemo<ColumnDef<Prodi>[]>(
    () => [
      {
        accessorFn: (row, index) => index + 1,
        header: "#",
      },
      { accessorFn: (row) => row.faculty?.name, header: "Fakultas" },
      { accessorKey: "name", header: "Name" },
      { accessorKey: "code", header: "Kode" },
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
    data: prodiList,
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
              <a href="/admin/prodi">Program Studi</a>
            </div>
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
                  <button
                    className="btn btn-primary btn-sm mb-2"
                    type="button"
                    data-toggle="collapse"
                    data-target="#collapseTambahProdi"
                  >
                    Tambah Prodi
                  </button>
                  <div className="collapse" id="collapseTambahProdi">
                    <div className="card card-body">
                      {/* Add Form */}
                      <AddForm
                        onSubmit={handleAddNewProdi}
                        collapseTargetId="collapseTambahProdi"
                        fields={[
                          {
                            label: "Nama Fakultas",
                            name: "facultyId",
                            type: "asyncSelect",
                            placeholder: "Pilih Fakultas",
                            value: newProdi.facultyId,
                            onChange: (e) => {
                              if (!e) return;

                              if ("value" in e) {
                                // Jika SelectOption
                                handleNewProdiChange("facultyId", e.value);
                              } else {
                                // Jika ChangeEvent
                                handleNewProdiChange(
                                  "facultyId",
                                  e.target.value
                                );
                              }
                            },
                            options: fakultasList.map((f) => ({
                              label: f.name,
                              value: f.id,
                            })),
                            loadOptions: async (inputValue: string) => {
                              // bisa filter dari fakultasList lokal
                              return fakultasList
                                .filter((f) =>
                                  f.name
                                    .toLowerCase()
                                    .includes(inputValue.toLowerCase())
                                )
                                .map((f) => ({ label: f.name, value: f.id }));
                            },
                          },
                          {
                            label: "Nama Prodi",
                            name: "name",
                            type: "text",
                            placeholder: "Masukkan Nama Prodi",
                            value: newProdi?.name,
                            onChange: (e) => {
                              if (!e) return;

                              if ("value" in e) {
                                // Jika SelectOption
                                handleNewProdiChange("name", e.value);
                              } else {
                                // Jika ChangeEvent
                                handleNewProdiChange("name", e.target.value);
                              }
                            },
                          },
                          {
                            label: "Kode",
                            name: "code",
                            type: "text",
                            placeholder: "Masukkan Kode Prodi",
                            value: newProdi?.code,
                            onChange: (e) => {
                              if (!e) return;

                              if ("value" in e) {
                                // Jika SelectOption
                                handleNewProdiChange("code", e.value);
                              } else {
                                // Jika ChangeEvent
                                handleNewProdiChange("code", e.target.value);
                              }
                            },
                          },
                        ]}
                      />
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

      {/* Edit Form */}
      <ModalEditForm
        title="Edit Program Studi"
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSubmit={handleSave}
        fields={[
          {
            label: "Nama Fakultas",
            name: "facultyId",
            type: "asyncSelect",
            placeholder: "Masukkan Nama Fakultas",
            value: selectedProdi.facultyId ?? "",
            onChange: (opt) =>
              setSelectedProdi((prev) => ({
                ...prev,
                facultyId: (opt as Option)?.value || "", // simpan id
              })),
            options: fakultasList.map((f) => ({ label: f.name, value: f.id })),
            loadOptions: async (inputValue: string) => {
              // bisa filter dari fakultasList lokal
              return fakultasList
                .filter((f) =>
                  f.name.toLowerCase().includes(inputValue.toLowerCase())
                )
                .map((f) => ({ label: f.name, value: f.id }));
            },
          },
          {
            label: "Nama Prodi",
            name: "name",
            type: "text",
            placeholder: "Masukkan Nama Prodi",
            value: selectedProdi.name ?? "",
            onChange: (e) => {
              if (e && "target" in e) {
                setSelectedProdi((prev) => ({
                  ...prev,
                  name: e.target.value, // aman
                }));
              }
            },
          },
          {
            label: "Kode",
            name: "code",
            type: "text",
            placeholder: "Masukkan Kode Prodi",
            value: selectedProdi.code ?? "",
            onChange: (e) => {
              if (e && "target" in e) {
                setSelectedProdi((prev) => ({
                  ...prev,
                  code: e.target.value, // aman
                }));
              }
            },
          },
        ]}
        submitText="Simpan"
        cancelText="Batal"
      />
    </>
  );
};

export default ProdiPage;