"use client";
import React, { useState, useEffect, useMemo } from "react";
import MyBarChart from "../../../components/myBarChart";
import api from "@/app/lib/axiosInstance";
import { time } from "console";
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

interface TimeLine {
  id: string;
  name: string;
  date: string;
  createdAt: string;
}
export interface SelectOption {
  label: string;
  value: string;
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
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTimeLine, setSelectedTimeLine] = useState<Partial<TimeLine>>(
    {}
  );
  const [newTimeLine, setNewTimeLine] = useState({
    name: "",
    date: "",
  });
  const [timeLineList, setTimeLineList] = useState<TimeLine[]>([]);

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
    fetchTimeLine();
  }, []);

  const fetchTimeLine = async () => {
    try {
      const data = await getTimeLine();
      const sortedData = data.sort((a: TimeLine, b: TimeLine) =>
        a.name.localeCompare(b.name, "id", { sensitivity: "base" })
      );
      setTimeLineList(sortedData);
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

  const handleInputChangeWrapper = (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | SelectOption
      | null
  ) => {
    if (e && "target" in e) {
      handleInputChange(
        e as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      );
    }
  };

  const handleNewTimeLineChange = (name: string, value: string) => {
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

  // Columns untuk tabel
  const columns = useMemo<ColumnDef<TimeLine>[]>(
    () => [
      {
        accessorFn: (row, index) => index + 1,
        header: "#",
      },
      { accessorKey: "name", header: "Name" },
      {
        accessorKey: "date",
        header: "Tanggal",
        cell: (info) =>
          new Date(info.getValue() as string).toLocaleDateString("id-ID", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
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
    data: timeLineList,
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
                    Tambah Timeline
                  </button>
                  <div className="collapse" id="collapseEditMatkul">
                    <div className="card card-body">
                      {/* Add Form */}
                      <AddForm
                        onSubmit={handleAddNewTimeLine}
                        collapseTargetId="collapseEditMatkul"
                        fields={[
                          {
                            label: "Nama Timeline",
                            name: "name",
                            type: "text",
                            placeholder: "Masukkan Nama Timeline",
                            value: newTimeLine?.name,
                            onChange: (e: any) =>
                              handleNewTimeLineChange("name", e.target.value),
                          },
                          {
                            label: "Tanggal Timeline",
                            name: "date",
                            type: "date",
                            value: newTimeLine?.date,
                            onChange: (e: any) =>
                              handleNewTimeLineChange("date", e.target.value),
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
        title="Edit Timeline"
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSubmit={handleSave}
        fields={[
          {
            label: "Nama Prodi",
            name: "name",
            type: "text",
            placeholder: "Masukkan Nama Timeline",
            value: selectedTimeLine.name ?? "",
            onChange: handleInputChangeWrapper,
          },
          {
            label: "Tanggal Timeline",
            name: "date",
            type: "date",
            value: formatDateForInput(selectedTimeLine.date),
            onChange: handleInputChangeWrapper,
          },
        ]}
        submitText="Simpan"
        cancelText="Batal"
      />
    </>
  );
};

export default JadwalPage;
