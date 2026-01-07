"use client";
import React from "react";
import api from "@/app/lib/axiosInstance";
import { AxiosError } from "axios";
import { useState, useEffect, useMemo } from "react";
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
import ModalEditForm from "@/app/components/form/EditForm";
import AddForm from "@/app/components/form/AddForm";

interface Ukt {
  id: string;
  group: string;
  amount: number;
  createdAt: string;
}

const getGolUkt = async () => {
  const res = await api.get("/tf-groups");
  return res.data.data;
};
const addGolUkt = async (data: { group: string; amount: number }) => {
  const res = await api.post("/tf-groups", data);
  return res.data;
};
const updateGolUkt = async (
  id: string,
  data: { group?: string; amount?: number }
) => {
  const res = await api.put(`/tf-groups/${id}`, data);
  return res.data;
};
const deleteGolUkt = async (id: string) => {
  const res = await api.delete(`/tf-groups/${id}`);
  return res.data;
};

const GolUKTPage = () => {
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGolUkt, setSelectedGolUkt] = useState<Partial<Ukt>>({});
  const [newGolUkt, setNewGolUkt] = useState({
    group: "",
    amount: 0,
  });
  const [goUktList, setGolUktList] = useState<Ukt[]>([]);

  // State untuk search, sorting, pagination
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "", desc: false },
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
      const sortedData = data.sort((a: Ukt, b: Ukt) =>
        a.group.localeCompare(b.group, "id", {
          numeric: true,
          sensitivity: "base",
        })
      );
      setGolUktList(sortedData);
    } catch (err) {
      console.error("Gagal fetch golongan ukt:", err);
    }
  };

  const openEditModal = (ukt: Ukt) => {
    setSelectedGolUkt(ukt);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedGolUkt({});
  };

  type SelectOption = { label: string; value: string | number };

  const handleInputChange = (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | SelectOption
      | null
  ) => {
    if (!e) return;

    // jika e adalah SelectOption
    if ("value" in e) {
      setSelectedGolUkt((prev) => ({
        ...prev,
        someField: e.value, // ganti someField sesuai field yang dipakai untuk async select
      }));
      return;
    }

    // jika e adalah ChangeEvent
    const { name, value } = e.target;
    setSelectedGolUkt((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleNewGolUktChange = (name: string, value: string | number) => {
    setNewGolUkt((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleAddNewGolUkt = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload = {
        group: newGolUkt.group,
        amount: Number(newGolUkt.amount), // pastikan number
      };

      const saved = await addGolUkt(payload);
      setGolUktList((prev) => [...prev, saved]);
      setNewGolUkt({ group: "", amount: 0 });
      fetchGolUkt();
    } catch (err) {
      console.error("Gagal tambah golongan UKT:", err);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedGolUkt.id) return;

    try {
      const updated = await updateGolUkt(selectedGolUkt.id, {
        group: selectedGolUkt.group,
        amount: selectedGolUkt.amount,
      });

      setGolUktList((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      closeEditModal();
      fetchGolUkt();
    } catch (err) {
      console.error("Gagal update gol ukt:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus golongan ukt ini?")) return;

    try {
      await deleteGolUkt(id);
      setGolUktList((prev) => prev.filter((p) => p.id !== id));
      alert("Golongan ukt berhasil dihapus!");
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
        alert("Gagal hapus golongan ukt: " + err.message);
        // fallback unknown error
        console.error("Unknown error:", err);
        alert("Gagal hapus: Terjadi kesalahan yang tidak diketahui");
      }
    }
  };

  // Columns untuk tabel
  const columns = useMemo<ColumnDef<Ukt>[]>(
    () => [
      {
        accessorFn: (row, index) => index + 1,
        header: "#",
      },
      { accessorKey: "group", header: "Golongan" },
      {
        accessorFn: (row) =>
          new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(row.amount),
        header: "Jumlah",
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
    data: goUktList,
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
          <h1>Pembayaran</h1>
          <div className="section-header-breadcrumb">
            <div className="breadcrumb-item">Pembayaran</div>
            <div className="breadcrumb-item">
              <a href="../pembayaran/golongan-ukt.html">
                Golongan Kuliah Tunggal
              </a>
            </div>
          </div>
        </div>

        <div className="section-body">
          <h2 className="section-title">Golongan UKT</h2>
          <p className="section-lead">
            Menampilkan semua data Golongan UKT yang ada pada universitas ini
          </p>
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <button
                    className="btn btn-primary btn-sm footer-left mb-2"
                    type="button"
                    data-toggle="collapse"
                    data-target="#collapseEditGolonganUKT"
                  >
                    Tambah Golongan UKT
                  </button>
                  <div className="collapse" id="collapseEditGolonganUKT">
                    <div className="card card-body">
                      {/* Add Form */}
                      <AddForm
                        onSubmit={handleAddNewGolUkt}
                        collapseTargetId="collapseEditGolonganUKT"
                        fields={[
                          {
                            label: "Nama Golongan",
                            name: "group",
                            type: "text",
                            placeholder: "Masukkan Nama Golongan",
                            value: newGolUkt.group,
                            onChange: (e) => {
                              if (!e) return;

                              // Jika e adalah SelectOption
                              if ("value" in e) {
                                handleNewGolUktChange("group", e.value);
                                return;
                              }

                              // Jika e adalah ChangeEvent
                              const { value } = e.target;
                              handleNewGolUktChange("group", value);
                            },
                          },
                          {
                            label: "Jumlah",
                            name: "amount",
                            type: "number",
                            placeholder: "Masukkan Jumlah",
                            value: newGolUkt?.amount,
                            onChange: (e) => {
                              if (!e) return;

                              // Jika e adalah SelectOption
                              if ("value" in e) {
                                handleNewGolUktChange("amount", e.value);
                                return;
                              }

                              // Jika e adalah ChangeEvent
                              const { value } = e.target;
                              handleNewGolUktChange("amount", value);
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
            label: "Nama Golongan",
            name: "group",
            type: "text",
            placeholder: "Masukkan Kode Prodi",
            value: selectedGolUkt?.group ?? "",
            onChange: handleInputChange,
          },
          {
            label: "Jumlah",
            name: "amount",
            type: "number",
            placeholder: "Masukkan Jumlah UKT",
            value: selectedGolUkt?.amount ?? "",
            onChange: handleInputChange,
          },
        ]}
        submitText="Simpan"
        cancelText="Batal"
      />
    </>
  );
};

export default GolUKTPage;
