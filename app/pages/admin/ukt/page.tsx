"use client";
import api from "@/app/lib/axiosInstance";
import { useState, useEffect, useMemo, useCallback } from "react";
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
// import FakultasPage from "../fakultas/page";

interface Mahasiswa {
  id: string;
  name: string;
  email: string;
  studentNumber: string;
  semester: number;
  classOf: number;
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

interface Kelas {
  id: string;
  name: string;
  majorId: string;
  major: Prodi;
}

interface Ukt {
  id: string;
  studentId: string;
  status: string;
  student: Mahasiswa;
  createdAt: string;
}

interface Option {
  label: string;
  value: string;
}

// API Services
const getMahasiswa = async () => {
  const res = await api.get("/students");
  return res.data.data;
};
const getProdi = async () => {
  const res = await api.get("/majors");
  return res.data.data;
};
const getUkt = async () => {
  const res = await api.get("/tuition-fees");
  return res.data.data;
};
const addUkt = async (data: { studentId: string; status: string }) => {
  const res = await api.post("/tuition-fees", data);
  return res.data;
};
const updateUkt = async (
  id: string,
  data: { studentId?: string; status?: string },
) => {
  const res = await api.put(`/tuition-fees/${id}`, data);
  return res.data;
};
const deleteProdi = async (id: string) => {
  const res = await api.delete(`/tuition-fees/${id}`);
  return res.data;
};

const UKTPage = () => {
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUkt, setSelectedUkt] = useState<Partial<Ukt>>({});
  const [newUkt, setNewUkt] = useState({
    studentId: "",
    status: "",
  });
  const [uktList, setUktList] = useState<Ukt[]>([]);
  const [MahasiswaList, setMahasiswaList] = useState<Mahasiswa[]>([]);
  const [prodi, setProdi] = useState<Prodi[]>([]);

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
        await fetchMahasiswa();
        await fetchProdi();
        await fetchUkt();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const fetchMahasiswa = async () => {
    try {
      const data = await getMahasiswa();
      const sortedData = data.sort((a: Mahasiswa, b: Mahasiswa) =>
        a.name.localeCompare(b.name, "id", { sensitivity: "base" }),
      );
      setMahasiswaList(sortedData);
    } catch (err) {
      console.error("Gagal fetch mahasiswa:", err);
    }
  };

  const fetchProdi = async () => {
    try {
      const data = await getProdi();
      setProdi(data);
    } catch (err) {
      console.error("Gagal fetch prodi:", err);
    }
  };

  const fetchUkt = async () => {
    try {
      const data = await getUkt();
      const sortedData = data.sort((a: Ukt, b: Ukt) =>
        a.student.name.localeCompare(b.student.name, "id", {
          sensitivity: "base",
        }),
      );
      setUktList(sortedData);
    } catch (err) {
      console.error("Gagal fetch ukt:", err);
    }
  };

  const getProdiAndFakultas = useCallback(
    (majorId: string) => {
      const prodis = prodi.find((m) => m.id === majorId);
      if (!prodis) return { majorName: "-", facultyName: "-" };
      return {
        majorName: prodis.name,
        facultyName: prodis.faculty?.name || "-",
      };
    },
    [prodi],
  );

  const openEditModal = (ukt: Ukt) => {
    setSelectedUkt(ukt);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUkt({});
  };

  // versi baru: menerima nama field + value
  const handleNewUktChange = (name: string, value: string) => {
    setNewUkt((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNewUkt = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const saved = await addUkt(newUkt);
      setUktList((prev) => [...prev, saved]);
      setNewUkt({ studentId: "", status: "" });
      fetchUkt();
    } catch (err) {
      console.error("Gagal tambah ukt:", err);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUkt.id) return;

    try {
      const updated = await updateUkt(selectedUkt.id, {
        status: selectedUkt.status,
      });

      setUktList((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p)),
      );
      console.log("Data yang akan dikirim:", newUkt);
      closeEditModal();
      fetchUkt();
    } catch (err) {
      console.error("Gagal update ukt:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus ukt ini?")) return;

    try {
      await deleteProdi(id);
      setUktList((prev) => prev.filter((p) => p.id !== id));
      alert("Ukt berhasil dihapus!");
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
  const columns = useMemo<ColumnDef<Ukt>[]>(
    () => [
      {
        accessorFn: (row, index) => index + 1,
        header: "#",
      },
      {
        accessorKey: "facultyId",
        header: "Fakultas",
        accessorFn: (row) =>
          getProdiAndFakultas(row.student?.class?.majorId ?? "").facultyName,
      },
      {
        accessorKey: "majorId",
        header: "Program Studi",
        accessorFn: (row) =>
          getProdiAndFakultas(row.student?.class?.majorId ?? "").majorName,
      },
      {
        accessorKey: "name",
        accessorFn: (row) => row.student?.name,
        header: "Nama",
      },
      { accessorFn: (row) => row.student?.studentNumber, header: "NIM" },
      { accessorFn: (row) => row.student?.semester, header: "Semester" },
      { accessorFn: (row) => row.status, header: "Status" },
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
    [getProdiAndFakultas],
  );

  // Inisialisasi react-table
  const table = useReactTable({
    data: uktList,
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
              <a href="../pembayaran/ukt.html">Uang Kuliah Tunggal</a>
            </div>
          </div>
        </div>

        <div className="section-body">
          <h2 className="section-title">UKT</h2>
          <p className="section-lead">
            Menampilkan semua data UKT yang ada pada universitas ini
          </p>
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <button
                    className="btn btn-primary btn-sm footer-left mb-2"
                    type="button"
                    data-toggle="collapse"
                    data-target="#collapseEditUKT"
                  >
                    Tambah UKT
                  </button>
                  <div className="collapse" id="collapseEditUKT">
                    <div className="card card-body">
                      {/* Add Form */}
                      <AddForm
                        onSubmit={handleAddNewUkt}
                        collapseTargetId="collapseEditUKT"
                        fields={[
                          {
                            label: "Nama Mahasiswa",
                            name: "studentId",
                            type: "asyncSelect",
                            placeholder: "Pilih Mahasiswa",
                            value: newUkt.studentId,
                            onChange: (e) => {
                              if (!e) return;

                              if ("value" in e) {
                                // Jika SelectOption
                                handleNewUktChange("studentId", e.value);
                              } else {
                                // Jika ChangeEvent
                                handleNewUktChange("studentId", e.target.value);
                              }
                            },
                            options: MahasiswaList.map((f) => ({
                              label: `${f.name} (${f.class?.major.name})`,
                              value: f.id,
                            })),
                            loadOptions: async (inputValue: string) => {
                              // bisa filter dari fakultasList lokal
                              return MahasiswaList.filter((f) =>
                                f.name
                                  .toLowerCase()
                                  .includes(inputValue.toLowerCase()),
                              ).map((f) => ({ label: f.name, value: f.id }));
                            },
                          },
                          {
                            label: "Status",
                            name: "status",
                            type: "text",
                            placeholder: "Masukkan Status UKT",
                            value: newUkt?.status,
                            onChange: (e) => {
                              if (!e) return;

                              if ("value" in e) {
                                // Jika SelectOption
                                handleNewUktChange("status", e.value);
                              } else {
                                // Jika ChangeEvent
                                handleNewUktChange("status", e.target.value);
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
        title="Edit UKT"
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSubmit={handleSave}
        fields={[
          {
            label: "Nama Mahasiswa",
            name: "studentId",
            type: "text",
            placeholder: "Masukkan Mahasiswa",
            value: selectedUkt.student?.name ?? "",
            onChange: (e) => {
              if (e && "target" in e) {
                setSelectedUkt((prev) => ({
                  ...prev,
                  studentId: e.target.value, // aman
                }));
              }
            },
            disabled: true,
          },
          {
            label: "Status",
            name: "status",
            type: "text",
            placeholder: "Masukkan Status",
            value: selectedUkt.status ?? "",
            onChange: (e) => {
              if (e && "target" in e) {
                setSelectedUkt((prev) => ({
                  ...prev,
                  status: e.target.value, // aman
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

export default UKTPage;
