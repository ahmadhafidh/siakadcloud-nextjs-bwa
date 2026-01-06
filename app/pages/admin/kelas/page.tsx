"use client";
import React, { useState, useMemo, useEffect, ChangeEvent } from "react";
import api from "@/app/lib/axiosInstance";
import { BarLoader } from "react-spinners";
import { AxiosError } from "axios";

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

interface Kelas {
  id: string;
  name: string;
  majorId: string;
  major?: Prodi;
  yearId: string;
  year?: TahunAjaran;
  createdAt: string;
}

interface Faculty {
  id: string;
  name: string;
}

interface Prodi {
  id: string;
  name: string;
  code: string;
  facultyId: string;
}

interface TahunAjaran {
  id: string;
  name: string;
  dateStart: string;
  dateEnd: string;
  status: boolean;
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
const getTahunAjaran = async () => {
  const res = await api.get("/years");
  return res.data.data;
};
const getKelas = async () => {
  const res = await api.get("/classes");
  return res.data.data;
};
const addKelas = async (data: {
  name: string;
  majorId: string;
  yearId: string;
}) => {
  const res = await api.post("/classes", data);
  return res.data;
};
const updateKelas = async (
  id: string,
  data: {
    name: string;
    majorId: string;
    yearId: string;
  }
) => {
  const res = await api.put(`/classes/${id}`, data);
  return res.data;
};
const deleteKelas = async (id: string) => {
  const res = await api.delete(`/classes/${id}`);
  return res.data;
};

const KelasPage = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedKelas, setSelectedKelas] = useState<Partial<Kelas>>({});
  const [newKelas, setNewkelas] = useState({
    name: "",
    majorId: "",
    yearId: "",
  });
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [prodiList, setProdiList] = useState<Prodi[]>([]);
  const [tahunAjaranList, setTahunAjaranList] = useState<TahunAjaran[]>([]);
  const [faculties, setFaculties] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  // State untuk search, sorting, pagination
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "id", desc: false },
  ]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // ambil data awal
  useEffect(() => {
    const fetchAll = async () => {
      try {
        await fetchFaculties();
        await fetchProdi();
        await fetchTahunAjaran();
        await fetchKelas();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const fetchFaculties = async () => {
    const res = await api.get("/faculties"); // pastikan endpoint return semua fakultas
    const data: Faculty[] = res.data.data;
    // bikin map facultyId -> facultyName
    const map: Record<string, string> = {};
    data.forEach((f) => {
      map[f.id] = f.name;
    });
    setFaculties(map);
  };

  const fetchProdi = async () => {
    try {
      const data = await getProdi();
      const sortedData = data.sort((a: Kelas, b: Kelas) =>
        a.name.localeCompare(b.name, "id", { sensitivity: "base" })
      );
      setProdiList(sortedData);
    } catch (err) {
      console.error("Gagal fetch prodi:", err);
    }
  };

  const fetchTahunAjaran = async () => {
    try {
      const data = await getTahunAjaran();
      setTahunAjaranList(data);
    } catch (err) {
      console.error("Gagal fetch tahun ajaran:", err);
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
      console.error("Gagal fetch kelas:", err);
    }
  };

  const openEditModal = (kelas: Kelas) => {
    setSelectedKelas(kelas);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedKelas({});
  };

  interface SelectOption {
    label: string;
    value: string;
  }

  const handleNewkelasChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | SelectOption
      | null
  ) => {
    if (!e) return; // kalau null, langsung return

    if ("target" in e) {
      // ini event dari input/select/textarea
      setNewkelas((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    } else if ("value" in e) {
      // ini dari SelectOption
      setNewkelas((prev) => ({
        ...prev,
        someField: e.value, // ganti 'someField' sesuai field yang sesuai
      }));
    }
  };

  const handleAddNewkelas = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const saved = await addKelas(newKelas);
      setKelasList((prev) => [...prev, saved]);
      setNewkelas({ name: "", majorId: "", yearId: "" });
      fetchKelas();
    } catch (err) {
      console.error("Gagal tambah kelas:", err);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedKelas.id) return;

    try {
      const updated = await updateKelas(selectedKelas.id, {
        name: selectedKelas.name ?? "",
        majorId: selectedKelas?.majorId ?? "",
        yearId: selectedKelas?.yearId ?? "",
      });

      setKelasList((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      closeEditModal();
      fetchKelas();
    } catch (err) {
      console.error("Gagal update kelas:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus kelas ini?")) return;

    try {
      await deleteKelas(id);
      setKelasList((prev) => prev.filter((p) => p.id !== id));
      alert("kelas berhasil dihapus!");
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
  const columns = useMemo<ColumnDef<Kelas>[]>(
    () => [
      {
        accessorFn: (row, index) => index + 1,
        header: "#",
        id: "id",
      },
      {
        accessorKey: "major.facultyId",
        header: "Fakultas",
        cell: ({ row }) => {
          return faculties[row.original.major?.facultyId ?? ""] || "-";
        },
      },
      {
        accessorKey: "major.name",
        header: "Program Studi",
        cell: ({ row }) => row.original.major?.name ?? "-",
      },
      {
        accessorKey: "year.name",
        header: "Tahun Ajaran",
        cell: ({ row }) => row.original.year?.name ?? "-",
      },
      { accessorKey: "name", header: "Name" },
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
          const kelas = row.original;
          return (
            <>
              <a
                href="#"
                className="btn btn-icon btn-primary m-1"
                onClick={(e) => {
                  e.preventDefault();
                  openEditModal(kelas);
                }}
              >
                <i className="far fa-edit"></i>
              </a>
              <a
                href="#"
                className="btn btn-icon btn-danger"
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete(kelas.id);
                }}
              >
                <i className="fa fa-trash"></i>
              </a>
            </>
          );
        },
      },
    ],
    [faculties]
  );

  // Inisialisasi react-table
  const table = useReactTable({
    data: kelasList,
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
              <a href="../master/kelas.html">Kelas</a>
            </div>
          </div>
        </div>

        <div className="section-body">
          <h2 className="section-title">Kelas</h2>
          <p className="section-lead">
            Menampilkan semua data Kelas yang ada pada universitas ini
          </p>

          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <button
                    className="btn btn-primary btn-sm mb-2"
                    type="button"
                    data-toggle="collapse"
                    data-target="#collapseEditKelas"
                  >
                    Tambah Kelas
                  </button>
                  <div className="collapse" id="collapseEditKelas">
                    <div className="card card-body">
                      <AddForm
                        onSubmit={handleAddNewkelas}
                        collapseTargetId="collapseEditKelas"
                        fields={[
                          {
                            label: "Nama Program Studi",
                            name: "majorId",
                            type: "asyncSelect",
                            placeholder: "Pilih Prodi",
                            value: newKelas.majorId,
                            onChange: (e) => {
                              if (!e) return;

                              if ("value" in e) {
                                // e adalah SelectOption
                                handleNewkelasChange({
                                  target: {
                                    name: "majorId",
                                    value: e.value ?? "",
                                  },
                                } as React.ChangeEvent<HTMLInputElement>);
                              } else {
                                // e adalah ChangeEvent asli
                                handleNewkelasChange(e);
                              }
                            },
                            options: prodiList.map((f) => ({
                              label: f.name,
                              value: f.id,
                            })),
                            loadOptions: async (inputValue: string) => {
                              // bisa filter dari fakultasList lokal
                              return prodiList
                                .filter((f) =>
                                  f.name
                                    .toLowerCase()
                                    .includes(inputValue.toLowerCase())
                                )
                                .map((f) => ({ label: f.name, value: f.id }));
                            },
                          },
                          {
                            label: "Nama Tahun Ajaran",
                            name: "yearId",
                            type: "asyncSelect",
                            placeholder: "Pilih Tahun Ajaran",
                            value: newKelas.yearId,
                            onChange: (e) => {
                              if (!e) return;

                              if ("value" in e) {
                                // ini SelectOption
                                handleNewkelasChange({
                                  target: {
                                    name: "yearId",
                                    value: e.value ?? "",
                                  },
                                } as React.ChangeEvent<HTMLInputElement>);
                              } else {
                                // ini ChangeEvent dari input/select/textarea biasa
                                handleNewkelasChange(e);
                              }
                            },
                            options: tahunAjaranList.map((f) => ({
                              label: f.name,
                              value: f.id,
                            })),
                            loadOptions: async (inputValue: string) => {
                              // bisa filter dari fakultasList lokal
                              return tahunAjaranList
                                .filter((f) =>
                                  f.name
                                    .toLowerCase()
                                    .includes(inputValue.toLowerCase())
                                )
                                .map((f) => ({ label: f.name, value: f.id }));
                            },
                          },
                          {
                            label: "Nama Kelas",
                            name: "name",
                            type: "text",
                            placeholder: "Masukkan Nama Kelas",
                            value: newKelas?.name,
                            onChange: handleNewkelasChange,
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
      <ModalEditForm
        title="Edit Program Kelas"
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSubmit={handleSave}
        fields={[
          {
            label: "Nama Program Studi",
            name: "majorId",
            type: "asyncSelect",
            placeholder: "Masukkan Nama Prodi",
            value: selectedKelas.majorId ?? "",
            onChange: (opt) =>
              setSelectedKelas((prev) => ({
                ...prev,
                majorId: (opt as Option)?.value || "", // simpan id
              })),
            options: prodiList.map((f) => ({ label: f.name, value: f.id })),
            loadOptions: async (inputValue: string) => {
              // bisa filter dari fakultasList lokal
              return prodiList
                .filter((f) =>
                  f.name.toLowerCase().includes(inputValue.toLowerCase())
                )
                .map((f) => ({ label: f.name, value: f.id }));
            },
          },
          {
            label: "Nama Tahun Ajaran",
            name: "yearId",
            type: "asyncSelect",
            placeholder: "Masukkan Tahun Ajaran",
            value: selectedKelas.yearId ?? "",
            onChange: (opt) =>
              setSelectedKelas((prev) => ({
                ...prev,
                yearId: (opt as Option)?.value || "", // simpan id
              })),
            options: tahunAjaranList.map((f) => ({
              label: f.name,
              value: f.id,
            })),
            loadOptions: async (inputValue: string) => {
              // bisa filter dari fakultasList lokal
              return tahunAjaranList
                .filter((f) =>
                  f.name.toLowerCase().includes(inputValue.toLowerCase())
                )
                .map((f) => ({ label: f.name, value: f.id }));
            },
          },
          {
            label: "Nama Kelas",
            name: "name",
            type: "text",
            placeholder: "Masukkan Nama Prodi",
            value: selectedKelas.name ?? "",
            onChange: (e) => {
              if (e && "target" in e) {
                setSelectedKelas((prev) => ({
                  ...prev,
                  name: e.target.value, // aman
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

export default KelasPage;
