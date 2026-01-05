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
import { DetailModal, renderTableKhs } from "@/app/components/form/DetailForm";

interface Khs {
  id: string;
  studentName: string;
  studentNumber: string;
  studentYearName: string;
  studentSemester: string;
  gpa: number;
  status: string;
  createdAt: string;
  courses: Matkul[];
}

interface Matkul {
  id: string;
  courseName: string;
  courseCode: string;
  courseScore: number;
  credits: string;
  lectureName: string;
}

// API Services
const getKhs = async () => {
  const res = await api.get("/study-plans");
  return res.data.data;
};

const KHSPage = () => {
  const [loading, setLoading] = useState(true);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [KhsList, setKhsList] = useState<Khs[]>([]);
  const [selectedKhs, setSelectedKhs] = useState<Partial<Khs>>({});

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
        await fetchKhs();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const fetchKhs = async () => {
    try {
      const data = await getKhs();
      const sortedData = data.sort((a: Khs, b: Khs) =>
        a.studentName.localeCompare(b.studentName, "id", {
          sensitivity: "base",
        })
      );
      setKhsList(sortedData);
    } catch (err) {
      console.error("Gagal fetch KHS:", err);
    }
  };

  const getGradeLetter = (score?: number) => {
    if (score === undefined || score === null) return "N/A";
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "E";
  };

  const openDetailModal = (Khs: Khs) => {
    setSelectedKhs(Khs);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedKhs({});
  };

  // Columns untuk tabel
  const columns = useMemo<ColumnDef<Khs>[]>(
    () => [
      {
        accessorFn: (row, index) => index + 1,
        header: "#",
      },
      { accessorKey: "studentName", header: "Name" },
      { accessorKey: "studentNumber", header: "NIM" },
      { accessorKey: "studentYearName", header: "Tahun Ajaran" },
      { accessorKey: "studentSemester", header: "Semester" },
      { accessorKey: "gpa", header: "GPA" },
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
    data: KhsList,
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
          <h1>Kartu Hasil Studi</h1>
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
        isOpen={isDetailModalOpen && !!selectedKhs}
        studentName={selectedKhs?.studentName ?? ""}
        title="Detail Kartu Hasil Studi"
        contentId="khsContent"
        onClose={closeDetailModal}
      >
        {selectedKhs && renderTableKhs(selectedKhs, getGradeLetter)}
      </DetailModal>
    </>
  );
};

export default KHSPage;
