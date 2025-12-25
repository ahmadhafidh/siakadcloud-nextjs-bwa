import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Modal Reusable
interface DetailModalProps {
  isOpen: boolean;
  title: string;
  studentName: string;
  contentId: string;
  onClose: () => void;
  children: React.ReactNode;
}

interface Krs {
  name?: string;
  studentName?: string;
  studentNumber?: number | string;
  studentYearName?: string;
  courses?: Course[];
}

interface Course {
  id: string | number;
  courseCode: string;
  courseName: string;
  credits: number | string;
  lectureName: string;
}

interface KhsCourse {
  id: string | number;
  courseCode: string;
  courseName: string;
  credits: number | string;
  courseScore: number;
}

interface Khs {
  studentName?: string;
  studentNumber?: string | number;
  studentYearName?: string;
  studentSemester?: string | number;
  courses?: KhsCourse[];
  gpa?: number;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  isOpen,
  title,
  studentName,
  contentId,
  onClose,
  children,
}) => {
  if (!isOpen) return null;

  const handleDownloadPdf = (
    contentId: string,
    fileName = "document.pdf",
    margin = 20 // default 20pt
  ) => {
    const element = document.getElementById(contentId);
    if (!element) return;

    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // posisikan gambar di PDF dengan margin
      pdf.addImage(imgData, "PNG", margin, margin, pdfWidth, pdfHeight);

      pdf.save(fileName);
    });
  };

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="close" onClick={onClose}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          {/* Body */}
          <div className="modal-body">
            <div id={contentId}>{children}</div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                handleDownloadPdf(contentId, `${title}-${studentName}.pdf`)
              }
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Fungsi render tabel KRS
export const renderTableKrs = (krs: Krs) => (
  <>
    <p>
      <strong>Nama :</strong> {krs.studentName ?? krs.name}
    </p>
    <p>
      <strong>NIM :</strong> {krs.studentNumber}
    </p>
    <p>
      <strong>Tahun Ajaran :</strong> {krs.studentYearName}
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
          {krs.courses?.map((course: Course) => (
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
              {krs.courses?.reduce(
                (total: number, c: Course) => total + Number(c.credits),
                0
              )}
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
  </>
);

// Fungsi render tabel KHS
export const renderTableKhs = (
  khs: Khs,
  getGradeLetter: (score: number) => string
) => (
  <>
    <p>
      <strong>Nama :</strong> {khs.studentName}
    </p>
    <p>
      <strong>NIM :</strong> {khs.studentNumber}
    </p>
    <p>
      <strong>Tahun Ajaran :</strong> {khs.studentYearName}
    </p>
    <p>
      <strong>Semester :</strong> {khs.studentSemester}
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
          {khs.courses?.map((course: KhsCourse, index: number) => (
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
              {khs.courses?.reduce(
                (total: number, c: KhsCourse) => total + Number(c.credits),
                0
              )}
            </td>
            <th colSpan={2}>Total Nilai Akhir</th>
            <td>
              {khs.courses && khs.courses.length > 0
                ? (() => {
                    const avg =
                      khs.courses.reduce(
                        (total: number, c: KhsCourse) =>
                          total + Number(c.courseScore),
                        0
                      ) / khs.courses.length;
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
              {khs.courses && khs.courses.length > 0
                ? (
                    (khs.courses.reduce(
                      (total: number, c: KhsCourse) =>
                        total + Number(c.courseScore),
                      0
                    ) /
                      khs.courses.length /
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
            <td>{khs.gpa ?? 0}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </>
);
