"use client";
import React, { useState, useEffect, useMemo } from "react";
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
import { DetailModal, renderTableKrs } from "@/app/components/form/DetailForm";

interface Krs {
  id: string;
  studentName: string;
  studentNumber: string;
  studentYearName: string;
  status: string;
  createdAt: string;
  courses: Matkul[];
}

interface Matkul {
  id: string;
  courseName: string;
  courseCode: string;
  credits: string;
  lectureName: string;
}

// API Services
const getKrs = async () => {
  const res = await api.get("/study-plans");
  return res.data.data;
};

const KRSPage = () => {
  const [loading, setLoading] = useState(true);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [krsList, setKrsList] = useState<Krs[]>([]);
  const [selectedKrs, setSelectedKrs] = useState<Partial<Krs>>({});

  // State untuk search, sorting, pagination
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "studentName", desc: false },
  ]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // ambil data awal
  useEffect(() => {
    const fetchAll = async () => {
      try {
        await fetchKrs();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const fetchKrs = async () => {
    try {
      const data = await getKrs();
      const sortedData = data.sort((a: Krs, b: Krs) =>
        a.studentName.localeCompare(b.studentName, "id", {
          sensitivity: "base",
        })
      );
      setKrsList(sortedData);
    } catch (err) {
      console.error("Gagal fetch prodi:", err);
    }
  };

  const openDetailModal = (krs: Krs) => {
    setSelectedKrs(krs);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedKrs({});
  };

  // Columns untuk tabel
  const columns = useMemo<ColumnDef<Krs>[]>(
    () => [
      {
        accessorFn: (row, index) => index + 1,
        header: "#",
      },
      { accessorKey: "studentName", header: "Name" },
      { accessorKey: "studentNumber", header: "NIM" },
      { accessorKey: "studentYearName", header: "Tahun Ajaran" },
      {
        accessorKey: "status", // atau accessorFn: row => row.status
        header: "Status",
        cell: ({ row }) => {
          const check = row.original.status ?? "ONPROCESS";
          const status = check.toLowerCase();
          const badgeClass =
            status === "approved"
              ? "badge-success"
              : status === "onprocess"
              ? "badge-warning"
              : status === "rejected"
              ? "badge-danger"
              : "badge-secondary";

          return <span style={{ width: "100px" }} className={`badge ${badgeClass}`}>{check}</span>;
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
          const prodi = row.original;
          return (
            <>
              <a
                href="#"
                className="btn btn-icon btn-primary m-1"
                onClick={(e) => {
                  e.preventDefault();
                  openDetailModal(prodi);
                }}
              >
                <i className="far fa-eye"></i>
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
    data: krsList,
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
          <h1>Kartu Rencana Studi</h1>
        </div>

        <div className="section-body">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
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
      <DetailModal
        isOpen={isDetailModalOpen && !!selectedKrs}
        title="Detail Kartu Rencana Studi"
        studentName={selectedKrs?.studentName ?? ""}
        contentId="krsContent"
        onClose={closeDetailModal}
      >
        {selectedKrs && renderTableKrs(selectedKrs)}
      </DetailModal>
    </>
  );
};

export default KRSPage;
