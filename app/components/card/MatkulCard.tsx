"use client";
import React from "react";

interface MataKuliahProps {
  id: string;
  classId: string;
  title: string;
  fakultas: string;
  prodi: string;
  sks: number;
  semester: number | string;
  classNames: string | string[];
  onEdit?: () => void;
  onDelete?: () => void;
}

const MataKuliahCard: React.FC<MataKuliahProps> = ({
  id,
  classId,
  title,
  fakultas,
  prodi,
  sks,
  semester,
  classNames,
  onEdit,
  onDelete,
}) => {
  const renderValue = (value: string | number | undefined) => {
    if (value === "" || value === null || value === undefined) {
      return "Mahasiswa belum terdaftar";
    }
    return value;
  };

  const renderClasses = (classes: string | string[] | undefined) => {
    if (!classes || (Array.isArray(classes) && classes.length === 0)) {
      return "Mahasiswa belum terdaftar";
    }
    const classArray = Array.isArray(classes) ? classes : classes.split(",");
    return classArray
      .map((cls) => cls.trim())
      .filter((cls) => cls.length > 0)
      .sort((a, b) => a.localeCompare(b)) // sorting abjad
      .join(", ");
  };

  return (
    <div className="card card-primary">
      <div className="card-header d-flex justify-content-between align-items-center border-bottom">
        <a
          href="#"
          className="text-decoration-none text-dark"
          onClick={(e) => {
            e.preventDefault();
            localStorage.clear();
            localStorage.setItem("id", id);
            localStorage.setItem("title", title);
            localStorage.setItem("prodi", prodi);
            localStorage.setItem(
              "classNames",
              Array.isArray(classNames) ? classNames.join(",") : classNames
            );
            localStorage.setItem("classId", classId);

            // redirect ke halaman tujuan
            window.location.href = "/pages/dosen/pilihmatkul";
          }}
        >
          <h6 className="mb-0">{title}</h6>
        </a>

        <div className="dropdown">
          <a href="#" data-toggle="dropdown">
            <i className="fas fa-ellipsis-v"></i>
          </a>
          <div className="dropdown-menu dropdown-menu-right">
            <button className="dropdown-item" onClick={onEdit}>
              Edit
            </button>
            <button className="dropdown-item" onClick={onDelete}>
              Hapus
            </button>
          </div>
        </div>
      </div>
      <div className="card-body p-3">
        <table className="table table-sm mb-0">
          <tbody>
            <tr>
              <td>Fakultas</td>
              <td>
                <strong>{fakultas}</strong>
              </td>
            </tr>
            <tr>
              <td>Program Studi</td>
              <td>
                <strong>{prodi}</strong>
              </td>
            </tr>
            <tr>
              <td>SKS</td>
              <td>
                <strong>{sks}</strong>
              </td>
            </tr>
            <tr>
              <td>Semester</td>
              <td>
                <strong>{renderValue(semester)}</strong>
              </td>
            </tr>
            <tr>
              <td>Kelas</td>
              <td>
                <strong>{renderClasses(classNames)}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MataKuliahCard;
