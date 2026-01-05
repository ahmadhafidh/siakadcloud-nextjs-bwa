"use client";
import React from "react";
import MyBarChart from "../../../components/myBarChart";
import api from "@/app/lib/axiosInstance";
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

// Komponen reusable
import DataTable from "@/app/components/table/DataTable";
import TableToolbar from "@/app/components/table/TableToolbar";
import TablePagination from "@/app/components/table/TablePagination";
import ModalEditForm from "@/app/components/form/EditForm";
import AddForm from "@/app/components/form/AddForm";

interface Matkul {
  id: string;
  name: string;
  code: string;
  lectureId: string;
  credits: number;
  lecture: Dosen;
  createdAt: string;
}

interface Dosen {
  id: string;
  name: string;
  major: Prodi;
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

interface Option {
  label: string;
  value: string;
}

// API Services
const getDosen = async () => {
  const res = await api.get("/lectures");
  return res.data.data;
};
const getMatkul = async () => {
  const res = await api.get("/courses");
  return res.data.data;
};
const addMatkul = async (data: {
  name: string;
  code: string;
  lectureId: string;
  credits: number;
}) => {
  const res = await api.post("/courses", data);
  return res.data;
};
const updateMatkul = async (
  id: string,
  data: {
    name: string;
    code: string;
    lectureId: string;
    credits: number;
  }
) => {
  const res = await api.put(`/courses/${id}`, data);
  return res.data;
};
const deleteMatkul = async (id: string) => {
  const res = await api.delete(`/courses/${id}`);
  return res.data;
};

const MatkulPage = () => {
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMatkul, setSelectedMatkul] = useState<Partial<Matkul>>({});
  const [newMatkul, setNewMatkul] = useState({
    name: "",
    code: "",
    lectureId: "",
    credits: 0,
  });
  const [matkulList, setMatkulList] = useState<Matkul[]>([]);
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
    fetchDosen();
    fetchMatkul();
  }, []);

  const fetchDosen = async () => {
    try {
      const data = await getDosen();
      const sortedData = data.sort((a: Prodi, b: Prodi) =>
        a.name.localeCompare(b.name, "id", { sensitivity: "base" })
      );

      setDosenList(sortedData);
    } catch (err) {
      console.error("Gagal fetch dosen:", err);
    }
  };

  const fetchMatkul = async () => {
    try {
      const data = await getMatkul();
      const sortedData = data.sort((a: Prodi, b: Prodi) =>
        a.name.localeCompare(b.name, "id", { sensitivity: "base" })
      );

      setMatkulList(sortedData);
    } catch (err) {
      console.error("Gagal fetch matkul:", err);
    }
  };

  const openEditModal = (matkul: Matkul) => {
    setSelectedMatkul(matkul);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedMatkul({});
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSelectedMatkul((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewMatkulChange = (name: string, value: string) => {
    setNewMatkul((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNewMatkul = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const saved = await addMatkul(newMatkul);
      setMatkulList((prev) => [...prev, saved]);
      setNewMatkul({
        name: "",
        code: "",
        lectureId: "",
        credits: 0,
      });
      fetchMatkul();
    } catch (err) {
      console.error("Gagal tambah matkul:", err);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedMatkul.id) return;

    try {
      const updated = await updateMatkul(selectedMatkul.id, {
        name: selectedMatkul.name ?? "",
        code: selectedMatkul.code ?? "",
        lectureId: selectedMatkul.lectureId ?? "",
        credits: selectedMatkul.credits ?? 0,
      });

      setMatkulList((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      closeEditModal();
      fetchMatkul();
    } catch (err) {
      console.error("Gagal update matkul:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus matkul ini?")) return;

    try {
      await deleteMatkul(id);
      setMatkulList((prev) => prev.filter((p) => p.id !== id));
      alert("Matkul berhasil dihapus!");
    } catch (err: any) {
      // Cek apakah error karena foreign key constraint
      if (err.response?.data?.data?.error?.includes("Foreign key constraint")) {
        alert(
          "Matkul tidak bisa dihapus karena masih memiliki data terkait (misal mahasiswa, jadwal, dll)."
        );
      } else {
        alert("Gagal hapus matkul: " + err.message);
      }
      console.error("Gagal hapus matkul:", err);
    }
  };

  // Columns untuk tabel
  const columns = useMemo<ColumnDef<Matkul>[]>(
    () => [
      {
        accessorFn: (row, index) => index + 1,
        header: "#",
      },
      {
        accessorFn: (row) => row.lecture?.major?.faculty?.name,
        header: "Fakultas",
      },
      {
        accessorFn: (row) => row.lecture?.major?.name,
        header: "Program Studi",
      },
      {
        accessorFn: (row) => row.lecture?.name,
        header: "Dosen",
      },
      { accessorKey: "code", header: "Kode Mata Kuliah" },
      { accessorKey: "name", header: "Name" },
      { accessorKey: "credits", header: "SKS" },
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
    data: matkulList,
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
    <section className="section">
      <div className="section-header">
        <h1>Akademik</h1>
        <div className="section-header-breadcrumb">
          <div className="breadcrumb-item">Akademik</div>
          <div className="breadcrumb-item">
            <a href="/admin/akademik/matkul">Mata Kuliah</a>
          </div>
        </div>
      </div>

      <div className="section-body">
        <h2 className="section-title">Mata Kuliah</h2>
        <p className="section-lead">
          Menampilkan semua data Mata Kuliah yang ada pada universitas ini
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
                  Tambah Mata Kuliah
                </button>
                <div className="collapse" id="collapseEditMatkul">
                  <div className="card card-body">
                    {/* Add Form */}
                    <AddForm
                      onSubmit={handleAddNewMatkul}
                      collapseTargetId="collapseEditMatkul"
                      fields={[
                        {
                          label: "Nama Dosen",
                          name: "lectureId",
                          type: "asyncSelect",
                          placeholder: "Pilih Dosen",
                          value: newMatkul.lectureId,
                          onChange: (opt: any) =>
                            handleNewMatkulChange(
                              "lectureId",
                              opt ? opt.value : ""
                            ),
                          options: dosenList.map((f) => ({
                            label: f.name,
                            value: f.id,
                          })),
                          loadOptions: async (inputValue: string) => {
                            // bisa filter dari fakultasList lokal
                            return dosenList
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
                          name: "name",
                          type: "text",
                          placeholder: "Masukkan Nama Mata Kuliah",
                          value: newMatkul?.name,
                          onChange: (e: any) =>
                            handleNewMatkulChange("name", e.target.value),
                        },
                        {
                          label: "Kode",
                          name: "code",
                          type: "text",
                          placeholder: "Masukkan Kode Mata Kuliah",
                          value: newMatkul?.code,
                          onChange: (e: any) =>
                            handleNewMatkulChange("code", e.target.value),
                        },
                        {
                          label: "SKS",
                          name: "credits",
                          type: "number",
                          placeholder: "Masukkan Jumlah SKS",
                          value: newMatkul?.credits,
                          onChange: (e: any) =>
                            handleNewMatkulChange("credits", e.target.value),
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
      {/* Edit Form */}
      <ModalEditForm
        title="Edit Program Studi"
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSubmit={handleSave}
        fields={[
          {
            label: "Nama Dosen",
            name: "lectureId",
            type: "asyncSelect",
            placeholder: "Masukkan Nama Dosen",
            value: selectedMatkul.lectureId ?? "",
            onChange: (opt) =>
              setSelectedMatkul((prev) => ({
                ...prev,
                lectureId: (opt as Option)?.value || "", // simpan id
              })),
            options: dosenList.map((f) => ({ label: f.name, value: f.id })),
            loadOptions: async (inputValue: string) => {
              // bisa filter dari fakultasList lokal
              return dosenList
                .filter((f) =>
                  f.name.toLowerCase().includes(inputValue.toLowerCase())
                )
                .map((f) => ({ label: f.name, value: f.id }));
            },
          },
          {
            label: "Nama Mata Kuliah",
            name: "name",
            type: "text",
            placeholder: "Masukkan Nama Mata Kuliah",
            value: selectedMatkul.name ?? "",
            onChange: (e) => {
              if (e && "target" in e) {
                setSelectedMatkul((prev) => ({
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
            placeholder: "Masukkan Kode Mata Kuliah",
            value: selectedMatkul.code ?? "",
            onChange: (e) => {
              if (e && "target" in e) {
                setSelectedMatkul((prev) => ({
                  ...prev,
                  code: e.target.value, // aman
                }));
              }
            },
          },
          {
            label: "SKS",
            name: "credits",
            type: "number",
            placeholder: "Masukkan Jumlah SKS",
            value: selectedMatkul.credits ?? "",
            onChange: (e) => {
              if (e && "target" in e) {
                setSelectedMatkul((prev) => ({
                  ...prev,
                  credits: Number(e.target.value), // aman
                }));
              }
            },
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
                  <h5 className="modal-title">Edit Mata Kuliah</h5>
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
                    <label>Dosen</label>
                    <select
                      className="form-control"
                      name="lectureId"
                      value={selectedMatkul.lectureId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">-- Pilih Dosen --</option>
                      {dosenList.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name} ({f.major.name}) ({f.major.faculty.name})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Kode Mata Kuliah</label>
                    <input
                      type="text"
                      name="code"
                      className="form-control"
                      value={selectedMatkul.code}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Nama Mata Kuliah</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={selectedMatkul.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Credits</label>
                    <input
                      type="number"
                      name="credits"
                      className="form-control"
                      value={selectedMatkul.credits}
                      onChange={handleInputChange}
                      required
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

export default MatkulPage;
