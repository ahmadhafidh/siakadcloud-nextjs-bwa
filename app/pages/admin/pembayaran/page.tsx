"use client";
import React, { useEffect, useState, useMemo } from "react";

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

import AddForm from "@/app/components/form/AddForm";

interface Pembayaran {
  id: string;
  code: string;
  status: string;
  createdAt: string;
  studentId: string;
  student: Mahasiswa;
}

interface Mahasiswa {
  id: string;
  name: string;
  studentNumber: string;
  semester: string;
  class: Kelas;
  tfGroup: GolUkt;
}

interface GolUkt {
  id: string;
  group: string;
}

interface Kelas {
  name: string;
  year: TahunAjaran;
}

interface TahunAjaran {
  id: string;
  name: string;
}

// API Services
const getMahasiswa = async () => {
  const res = await api.get("/students");
  return res.data.data;
};
const getPembayaran = async () => {
  const res = await api.get("/payments");
  return res.data.data;
};
const addPembayaran = async (data: {
  studentId: string;
  code: string;
  status: string;
}) => {
  const res = await api.post("/payments", data);
  return res.data;
};
const updatePembayaran = async (
  id: string,
  data: {
    status: string;
  }
) => {
  const res = await api.put(`/payments/${id}`, data);
  return res.data;
};
// const deletePembayaran = async (id: string) => {
//   const res = await api.delete(`/payments/${id}`);
//   return res.data;
// };

const PembayaranPage = () => {
  const [loading, setLoading] = useState(true);
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // const [selectedPembayaran, setSelectedPembayaran] = useState<
  //   Partial<Pembayaran>
  // >({});
  const [newPembayaran, setNewPembayaran] = useState({
    studentId: "",
    code: "",
    status: "UNPAID",
  });
  const [pembayaranList, setPembayaranList] = useState<Pembayaran[]>([]);
  const [mahasiswaList, setMahasiswaList] = useState<Mahasiswa[]>([]);

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
        await fetchPembayaran();
        await fetchMahasiswa();
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
        a.name.localeCompare(b.name, "id", {
          sensitivity: "base",
        })
      );
      setMahasiswaList(sortedData);
    } catch (err) {
      console.error("Gagal fetch mahasiswa:", err);
    }
  };

  const fetchPembayaran = async () => {
    try {
      const data = await getPembayaran();
      const sortedData = data.sort((a: Pembayaran, b: Pembayaran) =>
        a.student.name.localeCompare(b.student.name, "id", {
          sensitivity: "base",
        })
      );

      setPembayaranList(sortedData);
    } catch (err) {
      console.error("Gagal fetch matkul:", err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSelectedPembayaran((prev) => ({ ...prev, [name]: value }));
  };

  const generatePaymentCode = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4 digit
    return `PAY${year}${month}${day}${randomNum}`;
  };

  const handleNewPembayaranChange = (field: string, value: string) => {
    setNewPembayaran((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddNewPembayaran = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      const payload = {
        ...newPembayaran,
        code: generatePaymentCode(), // auto generate di sini saja
      };
      const saved = await addPembayaran(payload);
      setPembayaranList((prev) => [...prev, saved]);

      // reset form
      setNewPembayaran({
        studentId: "",
        code: "",
        status: "UNPAID", // default balik ke UNPAID
      });

      fetchPembayaran();
    } catch (err) {
      console.error("Gagal tambah pembayaran:", err);
    }
  };

  const handleToggleStatus = async (pembayaran: Pembayaran) => {
    try {
      const newStatus = pembayaran.status === "UNPAID" ? "PAID" : "UNPAID";

      const updated = await updatePembayaran(pembayaran.id, {
        status: newStatus,
      });

      setPembayaranList((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      fetchPembayaran();
    } catch (err) {
      console.error("Gagal toggle status pembayaran:", err);
    }
  };

  const statusOptions = [
    { label: "UNPAID", value: "UNPAID" },
    { label: "PAID", value: "PAID" },
  ];

  // Columns untuk tabel
  const columns = useMemo<ColumnDef<Pembayaran>[]>(
    () => [
      {
        accessorFn: (row, index) => index + 1,
        header: "#",
      },
      {
        id: "name",
        accessorFn: (row) => row.student?.name,
        header: "Nama",
      },
      { accessorFn: (row) => row.student?.studentNumber, header: "NIM" },
      { accessorKey: "code", header: "Kode Pembayaran" },
      { accessorFn: (row) => row.student?.tfGroup.group, header: "Golongan" },
      {
        accessorFn: (row) => row.student?.class.year.name,
        header: "Tahun Ajaran",
      },
      { accessorFn: (row) => row.student?.semester, header: "Semester" },
      {
        accessorFn: (row) => row.status, // ambil status
        id: "status", // optional, kalau accessorFn
        header: "Status",
        cell: ({ getValue }) => {
          const rawStatus = getValue<string>();
          const statusLower = rawStatus?.toLowerCase();
          const badgeClass =
            statusLower === "paid"
              ? "badge-success"
              : statusLower === "unpaid"
              ? "badge-warning"
              : "badge-secondary";
          return <span className={`badge ${badgeClass}`}>{rawStatus}</span>;
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
          const pembayaran = row.original; // ambil data asli row

          return (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleToggleStatus(pembayaran); // panggil fungsi toggle status
                }}
                className={`btn btn-sm mx-1 ${
                  pembayaran.status === "UNPAID" ? "btn-success" : "btn-danger"
                }`}
              >
                {pembayaran.status === "UNPAID" ? "Approve" : "Disapprove"}
              </button>
            </>
          );
        },
      },
    ],
    []
  );

  // Inisialisasi react-table
  const table = useReactTable({
    data: pembayaranList,
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
        <h1>Pembayaran</h1>
      </div>

      <div className="section-body">
        <h2 className="section-title">Pembayaran UKT</h2>
        <p className="section-lead">
          Menampilkan semua data status pembayaran UKT yang ada pada universitas
          ini
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
                  Tambah Data Pembayaran
                </button>
                <div className="collapse" id="collapseEditMatkul">
                  <div className="card card-body">
                    {/* Add Form */}
                    <AddForm
                      onSubmit={handleAddNewPembayaran}
                      collapseTargetId="collapseEditMatkul"
                      fields={[
                        {
                          label: "Nama Mahasiswa",
                          name: "studentId",
                          type: "asyncSelect",
                          placeholder: "Pilih Mahasiswa",
                          value: newPembayaran.studentId,
                          onChange: (e) => {
                            if (!e) return;

                            if ("value" in e) {
                              // Jika SelectOption
                              handleNewPembayaranChange("studentId", e.value);
                            } else {
                              // Jika ChangeEvent
                              handleNewPembayaranChange(
                                "studentId",
                                e.target.value
                              );
                            }
                          },
                          options: mahasiswaList.map((f) => ({
                            label: f.name,
                            value: f.id,
                          })),
                          loadOptions: async (inputValue: string) => {
                            // bisa filter dari fakultasList lokal
                            return mahasiswaList
                              .filter((f) =>
                                f.name
                                  .toLowerCase()
                                  .includes(inputValue.toLowerCase())
                              )
                              .map((f) => ({ label: f.name, value: f.id }));
                          },
                        },
                        {
                          label: "Status",
                          name: "status",
                          type: "asyncSelect",
                          placeholder: "Pilih Status",
                          value: newPembayaran.status,
                          onChange: (e) => {
                            if (!e) return;

                            if ("value" in e) {
                              // Jika SelectOption
                              handleNewPembayaranChange("status", e.value);
                            } else {
                              // Jika ChangeEvent
                              handleNewPembayaranChange(
                                "status",
                                e.target.value
                              );
                            }
                          },
                          options: statusOptions.map((f) => ({
                            label: f.label,
                            value: f.value,
                          })),
                          loadOptions: async (inputValue: string) => {
                            // bisa filter dari fakultasList lokal
                            return statusOptions
                              .filter((f) =>
                                f.label
                                  .toLowerCase()
                                  .includes(inputValue.toLowerCase())
                              )
                              .map((f) => ({ label: f.label, value: f.value }));
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

  );
};

export default PembayaranPage;
