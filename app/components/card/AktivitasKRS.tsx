import React from "react";

interface StudyPlans {
  courseName: string;
  studentName: string;
  status: string;
}

interface AktivitasKRSProps {
  studyPlans?: StudyPlans[];
  detailLink?: string;
  maxHeight?: string;
  divHeight?: string;
  showScrollbar?: boolean;
  headerMid?: string;
}

const AktivitasKRS: React.FC<AktivitasKRSProps> = ({
  studyPlans = [],
  detailLink = "/pages/dosen/krs",
  maxHeight = "400px",
  showScrollbar = true,
  headerMid = "Mahasiswa",
  divHeight = "400px",
}) => {
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "badge-success";
      case "rejected":
        return "badge-danger";
      default:
        return "badge-warning";
    }
  };

  const scrollbarStyles = showScrollbar ? {} : {};

  return (
    <div
      className="card shadow-sm"
      style={{
        width: "100%",
        margin: "20px 0",
        borderRadius: "0.9rem",
        height: divHeight,
      }}
    >
      {/* Header */}
      <div className="card-header d-flex justify-content-between align-items-center">
        <h4>Aktivitas KRS</h4>
        <a href={detailLink} className="btn btn-warning btn-sm">
          Detail <i className="fas fa-chevron-right ml-1"></i>
        </a>
      </div>

      {/* Body */}
      <div className="card-body p-0">
        <style jsx>{`
          .table-container::-webkit-scrollbar {
            width: ${showScrollbar ? "6px" : "0px"};
            height: 6px;
          }
          .table-container::-webkit-scrollbar-track {
            background: #f8f9fa;
            border-radius: 10px;
          }
          .table-container::-webkit-scrollbar-thumb {
            background: rgba(108, 117, 125, 0.3);
            border-radius: 10px;
          }
          .table-container::-webkit-scrollbar-thumb:hover {
            background: rgba(108, 117, 125, 0.5);
          }
        `}</style>
        <div
          className="table-responsive table-container"
          style={{
            maxHeight: maxHeight,
            overflowY: "auto",
            overflowX: "hidden",
            ...scrollbarStyles,
          }}
        >
          <table className="table table-striped mb-0">
            <thead>
              <tr>
                <th>Nama Mata Kuliah</th>
                <th>{headerMid}</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {studyPlans?.map((course, idx) => (
                <tr key={idx}>
                  <td>{course.courseName}</td>
                  <td>{course.studentName}</td>
                  <td>
                    <span
                      style={{ width: "100px" }}
                      className={`badge ${getStatusBadgeClass(course.status)}`}
                    >
                      {course.status}
                    </span>
                  </td>
                </tr>
              ))}

              {studyPlans?.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center text-muted">
                    Tidak ada data aktivitas KRS
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AktivitasKRS;
