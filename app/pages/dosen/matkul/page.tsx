"use client";
import React, { useState, useEffect } from "react";
import api from "@/app/lib/axiosInstance";
import MataKuliahCard from "@/app/components/card/MatkulCard";
import { BarLoader } from "react-spinners";

interface Matkul {
  id: string;
  name: string;
  credits: number;
  classId: string | string[];
  classNames: string | string[];
  semester: number | number[];
}

interface Dosen {
  id: string;
  name: string;
  majorName: string;
  facultyName: string;
  courses: Matkul[];
}

// API Services
const getMatkul = async () => {
  const res = await api.get("/manage-lectures/courses");
  return res.data.data;
};

const MatkulDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [dosen, setDosen] = useState<Dosen | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // ambil data awal
  useEffect(() => {
    const fetchAll = async () => {
      try {
        await fetchMatkul();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const fetchMatkul = async () => {
    setLoading(true);
    try {
      const data = await getMatkul();
      // const sortedData = data.sort((a: Matkul, b: Matkul) =>
      //   a.name.localeCompare(b.name, "id", {
      //     sensitivity: "base",
      //   })
      // );
      setDosen(data);
    } catch (err) {
      console.error("Gagal fetch mahasiswa:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter mataKuliah berdasarkan searchQuery
  const filteredMataKuliah = dosen?.courses.filter((mk) =>
    mk.name.toLowerCase().includes(searchQuery)
  );

  return (
    <section className="section">
      <div className="section-header">
        <h1>Akademik</h1>
      </div>

      <div className="section-body">
        <h2 className="section-title">Mata Kuliah</h2>
        <p className="section-lead">
          Menampilkan semua data mata kuliah yang anda ampu
        </p>
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="position-relative">
              <i
                className="fas fa-search position-absolute"
                style={{
                  top: "50%",
                  right: 15,
                  transform: "translateY(-50%)",
                  color: "#aaa",
                }}
              ></i>
              <input
                type="text"
                id="searchInput"
                className="form-control pr-5"
                placeholder="Cari mata kuliah..."
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className="col-md-6 text-right">
            <button className="btn btn-primary" onClick={fetchMatkul}>
              <i className="fas fa-sync-alt"></i> Refresh
            </button>
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
            <div className="row">
              {filteredMataKuliah?.map((Matkul, index) => (
                <div className="col-md-4 mb-4" key={index}>
                  <MataKuliahCard
                    id={Matkul.id}
                    classId={
                      Array.isArray(Matkul.classId)
                        ? Matkul.classId.join(", ")
                        : Matkul.classId
                    }
                    title={Matkul.name}
                    fakultas={dosen?.facultyName ?? ""}
                    prodi={dosen?.majorName ?? ""}
                    sks={Matkul.credits}
                    semester={
                      Array.isArray(Matkul.semester)
                        ? Matkul.semester.join(", ")
                        : Matkul.semester
                    }
                    classNames={
                      Array.isArray(Matkul.classNames)
                        ? Matkul.classNames.join(", ")
                        : Matkul.classNames
                    }
                    onEdit={() => console.log("Edit", Matkul.id)}
                    onDelete={() => console.log("Delete", Matkul.id)}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default MatkulDashboard;
