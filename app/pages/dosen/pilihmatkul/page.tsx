"use client";
import React, { useState, useEffect } from "react";
// import { BarLoader } from "react-spinners";

interface Kelas {
  className: string;
  classId: string;
}

const PilihMatkulDashboard = () => {
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [prodi, setProdi] = useState("");

  useEffect(() => {
    // akses localStorage hanya di browser
    const classNamesParam = localStorage.getItem("classNames");
    const classIdParam = localStorage.getItem("classId");
    const idParam = localStorage.getItem("id");
    const titleParam = localStorage.getItem("title");
    const prodiParam = localStorage.getItem("prodi");

    const classNames = classNamesParam
      ? classNamesParam.split(",").map((c) => c.trim())
      : [];
    const classIds = classIdParam
      ? classIdParam.split(",").map((c) => c.trim())
      : [];

    const initialKelas: Kelas[] = classNames.map((name, idx) => ({
      className: name.trim(),
      classId: classIds[idx]?.trim() ?? "",
    }));

    initialKelas.sort((a, b) =>
      a.className.localeCompare(b.className, "id", { sensitivity: "base" })
    );

    setKelasList(initialKelas);
    setId(idParam ?? "");
    setTitle(titleParam ?? "");
    setProdi(prodiParam ?? "");
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    const filtered = kelasList.filter((kelas) =>
      kelas.className.toLowerCase().includes(query)
    );
    setKelasList(filtered);
  };

  return (
    <section className="section">
      <div className="section-header">
        <h1>Akademik</h1>
      </div>

      <div className="section-body">
        <h2 className="section-title">Pilih Kelas</h2>
        <p className="section-lead">Semua kelas {prodi} yang anda ampu</p>

        <div className="position-relative mb-4">
          <i
            className="fas fa-search position-absolute"
            style={{
              top: "50%",
              left: 15,
              transform: "translateY(-50%)",
              color: "#aaa",
            }}
          />
          <input
            type="text"
            id="searchInput"
            className="form-control pl-5"
            placeholder="Cari kelas..."
            onChange={handleSearch}
          />
        </div>

        <div className="row">
          {kelasList.map((cls, index) => (
            <div className="col-4" key={index}>
              <a
                href="#"
                className="text-decoration-none text-dark"
                onClick={(e) => {
                  e.preventDefault();
                  localStorage.clear();
                  localStorage.setItem("MatkulId", id ?? "");
                  localStorage.setItem("KelasId", cls.classId);
                  localStorage.setItem("KelasName", cls.className);
                  window.location.href = "/pages/dosen/pilihkelas";
                }}
              >
                <div
                  className="card card-statistic-1"
                  style={{ cursor: "pointer" }}
                >
                  <div className="card-icon bg-primary">
                    <i
                      className="fa fa-chalkboard-teacher"
                      style={{ color: "white", fontSize: 20 }}
                    ></i>
                  </div>
                  <div className="card-wrap">
                    <div className="card-header">
                      <h4>
                        {prodi}-{title}
                      </h4>
                    </div>
                    <div className="card-body">{cls.className}</div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PilihMatkulDashboard;
