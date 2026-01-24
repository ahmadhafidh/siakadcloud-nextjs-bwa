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
import { AxiosError } from "axios";

// Komponen reusable
import DataTable from "@/app/components/table/DataTable";
import TableToolbar from "@/app/components/table/TableToolbar";
import TablePagination from "@/app/components/table/TablePagination";
import AddForm from "@/app/components/form/AddForm";
import ModalEditForm from "@/app/components/form/EditForm";

interface Fakultas {
  id: string;
  name: string;
  code: string;
  createdAt: string;
}

// bisa taruh di types.ts atau di file komponen
export interface SelectOption {
  label: string;
  value: string;
}

// API Services
const getFakultas = async () => {
  const res = await api.get("/faculties");
  return res.data.data;
};
const addFakultas = async (data: { name: string; code: string }) => {
  const res = await api.post("/faculties", data);
  return res.data;
};
const updateFakultas = async (
  id: string,
  data: { name?: string; code?: string },
) => {
  const res = await api.put(`/faculties/${id}`, data);
  return res.data;
};
const deleteFakultas = async (id: string) => {
  const res = await api.delete(`/faculties/${id}`);
  return res.data;
};

const FakultasPage = () => {
  const [fakultasList, setFakultasList] = useState<Fakultas[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFakultas, setSelectedFakultas] = useState<Fakultas | null>(
    null,
  );

  // State input tambah/edit
  const [nama, setNama] = useState("");
  const [kode, setKode] = useState("");

  // State untuk search, sorting, pagination
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Generate kode otomatis dari nama
  const generateKode = (namaFakultas: string) => {
    if (!namaFakultas) return "";
    return namaFakultas
      .split(" ")
      .map((kata) => kata[0]?.toUpperCase())
      .join("");
  };
  const handleNamaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNama(value);
    setKode(generateKode(value));
  };

  // wrapper agar cocok dengan tipe onChange di FieldConfig
  const handleNamaChangeWrapper = (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | SelectOption
      | null,
  ) => {
    if (e && "target" in e) {
      handleNamaChange(e as React.ChangeEvent<HTMLInputElement>);
    }
  };

  // Fetch data
  useEffect(() => {
    const fetchAll = async () => {
      try {
        await fetchFakultas();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const fetchFakultas = async () => {
    setLoading(true);
    const data = await getFakultas();
    const sortedData = data.sort((a: Fakultas, b: Fakultas) =>
      a.name.localeCompare(b.name, "id", { sensitivity: "base" }),
    );
    setFakultasList(sortedData);
    setLoading(false);
  };

  // Submit tambah fakultas
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addFakultas({ name: nama, code: kode });
    setNama("");
    setKode("");
    fetchFakultas();
  };

  // Edit
  const openEditModal = useCallback((fakultas: Fakultas) => {
    setSelectedFakultas(fakultas);
    setIsEditModalOpen(true);
  }, []);
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedFakultas(null);
  };
  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFakultas) {
      await updateFakultas(selectedFakultas.id, {
        name: selectedFakultas.name,
        code: selectedFakultas.code,
      });
      fetchFakultas();
      closeEditModal();
    }
  };

  // Hapus fakultas
  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Yakin hapus fakultas ini?")) return;
    try {
      await deleteFakultas(id);
      setFakultasList((prev) => prev.filter((p) => p.id !== id));
      alert("Fakultas berhasil dihapus!");
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
    fetchFakultas();
  }, []);

  // Columns untuk tabel
  const columns = useMemo<ColumnDef<Fakultas>[]>(
    () => [
      {
        accessorFn: (row, index) => index + 1,
        header: "#",
      },
      { accessorKey: "name", header: "Nama" },
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
          const fakultas = row.original;
          return (
            <>
              <a
                href="#"
                className="btn btn-icon btn-primary m-1"
                onClick={(e) => {
                  e.preventDefault();
                  openEditModal(fakultas);
                }}
              >
                <i className="far fa-edit"></i>
              </a>
              <a
                href="#"
                className="btn btn-icon btn-danger"
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete(fakultas.id);
                }}
              >
                <i className="fa fa-trash"></i>
              </a>
            </>
          );
        },
      },
    ],
    [handleDelete, openEditModal],
  );

  // Inisialisasi react-table
  const table = useReactTable({
    data: fakultasList,
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
              <a href="#">Fakultas</a>
            </div>
          </div>
        </div>

        <h2 className="section-title">Fakultas</h2>
        <p className="section-lead">
          Menampilkan semua data fakultas yang ada pada universitas ini
        </p>

        <div className="card">
          <div className="card-body">
            <button
              className="btn btn-primary btn-sm footer-left mb-2"
              type="button"
              data-toggle="collapse"
              data-target="#collapseTambahFakultas"
            >
              Tambah Fakultas
            </button>
            <div className="collapse" id="collapseTambahFakultas">
              <div className="card card-body">
                {/* Tambah Fakultas */}
                <AddForm
                  onSubmit={handleSubmit}
                  collapseTargetId="collapseTambahFakultas"
                  fields={[
                    {
                      label: "Nama Fakultas",
                      name: "name",
                      type: "text",
                      placeholder: "Masukkan Nama Fakultas",
                      value: nama,
                      onChange: handleNamaChangeWrapper,
                    },
                    {
                      label: "Kode",
                      name: "code",
                      type: "text",
                      placeholder: "Masukkan Kode Prodi",
                      value: kode,
                      disabled: true,
                      onChange: handleNamaChangeWrapper,
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
      </section>
      {/* Modal Edit */}
      <ModalEditForm
        title="Edit Program Studi"
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSubmit={handleEditSave}
        fields={[
          {
            label: "Nama Prodi",
            name: "name",
            type: "text",
            placeholder: "Masukkan Nama Prodi",
            value: selectedFakultas?.name ?? "",
            onChange: (e) => {
              if (e && "target" in e) {
                setSelectedFakultas({
                  ...selectedFakultas!,
                  name: e.target.value,
                });
              }
            },
          },
          {
            label: "Kode",
            name: "code",
            type: "text",
            placeholder: "Masukkan Kode Prodi",
            value: selectedFakultas?.code ?? "",
            onChange: (e) => {
              if (e && "target" in e) {
                setSelectedFakultas({
                  ...selectedFakultas!,
                  code: e.target.value,
                });
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

export default FakultasPage;
