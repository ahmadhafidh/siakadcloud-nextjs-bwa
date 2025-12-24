'use client';
import React, { useState, useEffect } from 'react';
import api from "@/app/lib/axiosInstance";

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
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedKrs, setSelectedKrs] = useState<Partial<Krs>>({});
  const [krsList, setKrsList] = useState<Krs[]>([]);

  //ambil data awal
  useEffect(() => {
    fetchKrs()
  }, [])

  const fetchKrs = async() => {
    try {
      const data = await getKrs()
      setKrsList(data)
    } catch (err) {
      console.error("Gagal fetch prodi:", err)
    }
  }

  const openDetailModal = (krs: Krs) => {
    setSelectedKrs(krs);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedKrs({});
  };

  return (
    <section className="section">
      <div className="section-header">
        <h1>Kartu Rencana Studi</h1>
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
                        <th>Status</th>
                        <th>Dibuat pada</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {krsList.map((krs, index)=>(
                      <tr key={krs.id}>
                        <td>{index+1}</td>
                        <td>{krs.studentName}</td>
                        <td>{krs.studentNumber}</td>
                        <td>{krs.studentYearName}</td>
                        <td>
                          <span
                            className={`badge ${
                              krs.status.toLowerCase() === "disetujui"
                                ? "badge-success"
                                : krs.status.toLowerCase() === "proses"
                                ? "badge-warning"
                                : krs.status.toLowerCase() === "ditolak"
                                ? "badge-danger"
                                : "badge-secondary" // default kalau tidak cocok
                            }`}
                          >
                            {krs.status}
                          </span>
                        </td>
                        <td>
                          {new Date(krs.createdAt).toLocaleDateString(
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
                              openDetailModal(krs)
                            }}
                            className="btn btn-icon btn-primary"
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

      {isDetailModalOpen && selectedKrs && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detail Kartu Rencana Studi</h5>
                <button
                  type="button"
                  className="close"
                  onClick={closeDetailModal}
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>

              <div className="modal-body">
                <div id="krsContent">
                  <p>
                    <strong>Nama :</strong> {selectedKrs.studentName}
                  </p>
                  <p>
                    <strong>NIM :</strong> {selectedKrs.studentNumber}
                  </p>
                  <p>
                    <strong>Tahun Ajaran :</strong>{" "}
                    {selectedKrs.studentYearName}
                  </p>

                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Kode MK</th>
                          <th>Nama Mata Kuliah</th>
                          <th>SKS</th>
                          <th>Dosen Pengampu</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedKrs.courses?.map((course) => (
                          <tr key={course.id}>
                            <td>{course.courseCode}</td>
                            <td>{course.courseName}</td>
                            <td>{course.credits}</td>
                            <td>{course.lectureName}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <th colSpan={2}>Total SKS</th>
                          <th colSpan={2}>
                            {selectedKrs.courses?.reduce(
                              (total, c) => total + Number(c.credits),
                              0
                            )}
                          </th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  // onClick={() => downloadPDF("krsContent")}
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

export default KRSPage;
