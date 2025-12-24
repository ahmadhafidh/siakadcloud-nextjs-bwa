'use client';
import React, { useState, useEffect } from 'react';
import api from "@/app/lib/axiosInstance";

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
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [KhsList, setKhsList] = useState<Khs[]>([]);
  const [selectedKhs, setSelectedKhs] = useState<Partial<Khs>>({});

  //ambil data awal
  useEffect(() => {
    fetchKhs()
  }, [])

  const fetchKhs = async() => {
    try {
      const data = await getKhs()
      setKhsList(data)
    } catch (err) {
      console.error("Gagal fetch prodi:", err)
    }
  }

  const getGradeLetter = (score?: number) => {
    if (score === undefined || score === null) return "N/A";
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "E";
  }

  const openDetailModal = (khs: Khs) => {
    setSelectedKhs(khs);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedKhs({});
  };

  return (
    <section className="section">
      <div className="section-header">
        <h1>Kartu Hasil Studi</h1>
      </div>

      <div className="section-body">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped" id="table-1">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Nama</th>
                        <th>NIM</th>
                        <th>Tahun Ajaran</th>
                        <th>Semester</th>
                        <th>GPA</th>
                        <th>Dibuat pada</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {KhsList.map((Khs, index) => (
                        <tr key={Khs.id}>
                          <td>{index + 1}</td>
                          <td>{Khs.studentName}</td>
                          <td>{Khs.studentNumber}</td>
                          <td>{Khs.studentYearName}</td>
                          <td>{Khs.studentSemester}</td>
                          <td>{Khs.gpa}</td>
                          <td>
                            {new Date(Khs.createdAt).toLocaleDateString(
                              "id-ID",
                              {
                                weekday: "long",
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </td>
                          <td>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                openDetailModal(Khs);
                              }}
                              className="btn btn-icon btn-primary mx-1"
                            >
                              <i className="fa fa-eye"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isDetailModalOpen && selectedKhs && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              {/* Header */}
              <div className="modal-header">
                <h5 className="modal-title">Detail Kartu Hasil Studi</h5>
                <button
                  type="button"
                  className="close"
                  onClick={closeDetailModal}
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>

              {/* Body */}
              <div className="modal-body">
                <div id="khsContent">
                  <p>
                    <strong>Nama :</strong> {selectedKhs.studentName}
                  </p>
                  <p>
                    <strong>NIM :</strong> {selectedKhs.studentNumber}
                  </p>
                  <p>
                    <strong>Tahun Ajaran :</strong>{" "}
                    {selectedKhs.studentYearName}
                  </p>
                  <p>
                    <strong>Semester :</strong> {selectedKhs.studentSemester}
                  </p>

                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Kode MK</th>
                          <th>Nama Mata Kuliah</th>
                          <th>SKS</th>
                          <th>Huruf Mutu</th>
                          <th>Bobot</th>
                          <th>Nilai</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedKhs.courses?.map((course, index) => (
                          <tr key={course.id}>
                            <td>{index + 1}</td>
                            <td>{course.courseCode}</td>
                            <td>{course.courseName}</td>
                            <td>{course.credits}</td>
                            <td>{getGradeLetter(course.courseScore)}</td>
                            <td>{course.credits}</td>
                            <td>{course.courseScore ?? "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <th colSpan={3}>Total SKS</th>
                          <td>
                            {selectedKhs.courses?.reduce(
                              (total, c) => total + Number(c.credits),
                              0
                            )}
                          </td>
                          <th colSpan={2}>Total Nilai Akhir</th>
                          <td>
                            {selectedKhs.courses &&
                            selectedKhs.courses.length > 0
                              ? (() => {
                                  const avg =
                                    selectedKhs.courses.reduce(
                                      (total, c) =>
                                        total + Number(c.courseScore),
                                      0
                                    ) / selectedKhs.courses.length;

                                  // Jika avg bulat, tampilkan tanpa desimal, kalau tidak bulat tampilkan 2 desimal
                                  return avg % 1 === 0 ? avg : avg.toFixed(2);
                                })()
                              : 0}
                          </td>
                        </tr>
                        <tr>
                          <th colSpan={6} className="text-right">
                            IP Semester
                          </th>
                          <td>
                            {selectedKhs.courses &&
                            selectedKhs.courses.length > 0
                              ? (
                                  (selectedKhs.courses.reduce(
                                    (total, c) => total + Number(c.courseScore),
                                    0
                                  ) /
                                    selectedKhs.courses.length /
                                    100) *
                                  4
                                ).toFixed(2)
                              : 0}
                          </td>
                        </tr>
                        <tr>
                          <th colSpan={6} className="text-right">
                            IPK
                          </th>
                          <td>{selectedKhs.gpa ?? 0}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  // onClick={() => {
                  //   const element = document.getElementById("khsContent");
                  //   if (element) {
                  //     import("html2pdf.js").then((html2pdf) => {
                  //       html2pdf.default().from(element).save("KHS.pdf");
                  //     });
                  //   }
                  // }}
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default KHSPage;
