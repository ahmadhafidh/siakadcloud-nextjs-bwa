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
import { DetailModal, renderTableKrs } from "@/app/components/form/DetailForm";

// Komponen reusable
import DataTable from "@/app/components/table/DataTable";
import TableToolbar from "@/app/components/table/TableToolbar";
import TablePagination from "@/app/components/table/TablePagination";

interface Krs {
  id: string;
  studentName: string;
  studentNumber: string;
  studentYearName: string;
  studentSemester: number;
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
  credits: number;
  lectureName: string;
}

interface ApiCourse {
  id: string;
  code: string;
  name: string;
  credits: number;
  score: number;
  lectureName: string;
}

interface ApiKrs {
  studentName: string;
  studentNumber: string;
  year: string;
  semester: number;
  gpa: number;
  courses: ApiCourse[];
}

interface ApiMatkulResponse {
  studentId: string;
  studentName: string;
  studentNumber: string;
  year: string;
  courses: {
    id: string;
    code: string;
    name: string;
    credits: number;
    year: string;
    lectureId: string;
    lectureName: string;
    majorName: string;
    facultyName: string;
  };
}

const getKrs = async () => {
  const res = await api.get("/manage-students/studyplan");
  return res.data.data;
};

const getMatkul = async () => {
  const res = await api.get("/manage-students/allcourse");
  return res.data.data;
};

const postKrs = async (selectedMatkul: string[]) => {
  try {
    const res = await api.post("/manage-students/studyplan", {
      courseId: selectedMatkul.join(","),
      status: "ONPROCESS",
    });

    if (res.data.success) {
      return res.data.data;
    } else {
      throw new Error(res.data.message || "Gagal menyimpan KRS");
    }
  } catch (err) {
    console.error("Error post KRS:", err);
    throw err;
  }
};

const MahasiswaKRS = () => {
  const [studentInfo, setStudentInfo] = useState({
    name: "",
    nim: "",
    year: "",
  });
  const [matkulList, setMatkulList] = useState<ApiMatkulResponse["courses"][]>(
    []
  );
  const [krsList, setKrsList] = useState<Krs[]>([]);
  const [loading, setLoading] = useState(true);
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedKrs, setSelectedKrs] = useState<Partial<Krs>>({});
  const [selectedMatkul, setSelectedMatkul] = useState<string[]>([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [existingCourseNames, setExistingCourseNames] = useState<string[]>([]);
  // const [yearOptions, setYearOptions] = useState<string[]>([]);
  // const [selectedYear, setSelectedYear] = useState<string>("");

  // State untuk search, sorting, pagination
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "year", desc: false },
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
        await fetchMatkul();
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
      setKrsList(data);

      const courseNames = data.flatMap((krs: ApiKrs) =>
        krs.courses.map((c) => c.name)
      );
      setExistingCourseNames(courseNames);
    } catch (err) {
      console.error("Gagal fetch Krs:", err);
    }
  };

  const fetchMatkul = async () => {
    try {
      const res = await getMatkul();
      const data: ApiMatkulResponse[] = res;

      if (data.length > 0) {
        setStudentInfo({
          name: data[0].studentName,
          nim: data[0].studentNumber,
          year: data[0].year,
        });

        // ambil tahun unik & urutkan ascending
        // const years = Array.from(new Set(data.map((d) => d.year))).sort(
        //   (a, b) => a.localeCompare(b, "id", { numeric: true })
        // );
        // setYearOptions(years);
        // setSelectedYear(years[0]);
      }

      // Flatten matkul + sort ascending by code
      const sortedMatkul = data
        .map((d) => d.courses)
        .sort((a, b) => a.code.localeCompare(b.code, "id", { numeric: true }));

      setMatkulList(sortedMatkul);
    } catch (err) {
      console.error("Gagal fetch Matkul:", err);
    }
  };

  const mapApiToKrs = (apiData: ApiKrs): Krs => ({
    studentName: apiData.studentName,
    studentNumber: apiData.studentNumber,
    studentYearName: apiData.year,
    studentSemester: apiData.semester,
    gpa: apiData.gpa,
    courses: apiData.courses.map((c: ApiCourse) => ({
      id: c.id,
      courseCode: c.code,
      courseName: c.name,
      credits: c.credits,
      courseScore: c.score,
      lectureName: c.lectureName,
    })),
    id: "",
    status: "",
    createdAt: "",
  });

  const openDetailModal = (data: ApiKrs | Krs) => {
    if ("year" in data) {
      // kalau dari API
      setSelectedKrs(mapApiToKrs(data));
    } else {
      // kalau sudah berbentuk Khs
      setSelectedKrs(data);
    }
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedKrs({});
  };

  const handleSubmitKrs = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await postKrs(selectedMatkul);
      alert("KRS berhasil disimpan!");
      setSelectedMatkul([]);
      fetchKrs(); // refresh daftar KRS
    } catch {
      alert("Gagal menyimpan KRS");
    }
  };

  // Columns untuk tabel
  const columns = useMemo<ColumnDef<Krs>[]>(
    () => [
      {
        accessorFn: (row, index) => index + 1,
        header: "#",
      },
      { accessorKey: "year", header: "Tahun Ajaran" },
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

          return (
            <span style={{ width: 100 }} className={`badge ${badgeClass}`}>
              {check}
            </span>
          );
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
                  <button
                    className="btn btn-primary btn-sm footer-left mb-2"
                    type="button"
                    data-toggle="collapse"
                    data-target="#collapseTambahKRS"
                  >
                    Tambah Kartu Rencana Studi
                  </button>

                  <div className="collapse" id="collapseTambahKRS">
                    <div className="card card-body">
                      <form>
                        <div className="row">
                          <div className="form-group col-md-6">
                            <label>Nama Mahasiswa</label>
                            <input
                              type="text"
                              className="form-control"
                              value={studentInfo.name}
                              readOnly
                            />
                          </div>
                          <div className="form-group col-md-3">
                            <label>NIM</label>
                            <input
                              type="text"
                              className="form-control"
                              value={studentInfo.nim}
                              readOnly
                            />
                          </div>
                          <div className="form-group col-md-3">
                            <label>Tahun Ajaran</label>
                            <input
                              type="text"
                              className="form-control"
                              value={studentInfo.year}
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="table-responsive mt-4">
                          <table className="table table-bordered">
                            <thead className="thead-light">
                              <tr>
                                <th style={{ width: "5%" }}>Pilih</th>
                                <th>Kode MK</th>
                                <th>Nama Mata Kuliah</th>
                                <th>SKS</th>
                                <th>Dosen Pengampu</th>
                              </tr>
                            </thead>
                            <tbody>
                              {matkulList
                                // .filter(
                                //   (matkul) => matkul.year === selectedYear
                                // )
                                .map((matkul) => {
                                  const alreadyTaken =
                                    existingCourseNames.includes(matkul.name);
                                  return (
                                    <tr key={matkul.id}>
                                      <td>
                                        <input
                                          type="checkbox"
                                          disabled={alreadyTaken}
                                          checked={selectedMatkul.includes(
                                            matkul.id
                                          )}
                                          onChange={(e) => {
                                            if (e.target.checked) {
                                              setSelectedMatkul([
                                                ...selectedMatkul,
                                                matkul.id,
                                              ]);
                                            } else {
                                              setSelectedMatkul(
                                                selectedMatkul.filter(
                                                  (id) => id !== matkul.id
                                                )
                                              );
                                            }
                                          }}
                                        />
                                      </td>
                                      <td>{matkul.code}</td>
                                      <td>
                                        {matkul.name}
                                        {alreadyTaken && (
                                          <span className="text-danger ml-2">
                                            (sudah diambil)
                                          </span>
                                        )}
                                      </td>
                                      <td>{matkul.credits}</td>
                                      <td>{matkul.lectureName}</td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>

                        <div className="form-group mt-3">
                          <button
                            type="submit"
                            className="btn btn-primary"
                            onClick={handleSubmitKrs}
                          >
                            Simpan KRS
                          </button>
                        </div>
                      </form>
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
      <DetailModal
        isOpen={isDetailModalOpen && !!selectedKrs}
        studentName={selectedKrs?.studentName ?? ""}
        title="Detail Kartu Rencana Studi"
        contentId="krsContent"
        onClose={closeDetailModal}
      >
        {selectedKrs && renderTableKrs(selectedKrs)}
      </DetailModal>
    </>
  );
};

export default MahasiswaKRS;
