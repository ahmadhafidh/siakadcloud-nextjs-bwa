"use client";
import React, { Suspense, useEffect, useState } from "react";
import AbsensiToggle from "@/app/components/button/AbsensiToggle";
import api from "@/app/lib/axiosInstance";
import { BarLoader } from "react-spinners";

interface Student {
  id: string;
  name: string;
  studentNumber: string;
  studyPlan: StudyPlan[];
}

interface StudyPlan {
  id: string;
  courses: Course[];
}

interface Course {
  id: string;
  score?: number | null;
  studyPlanId: string;
  courseId: string;
  attendance1?: string | null;
  attendance2?: string | null;
  attendance3?: string | null;
  attendance4?: string | null;
  attendance5?: string | null;
  attendance6?: string | null;
  attendance7?: string | null;
  attendance8?: string | null;
  attendance9?: string | null;
  attendance10?: string | null;
  attendance11?: string | null;
  attendance12?: string | null;
  attendance13?: string | null;
  attendance14?: string | null;
  attendance15?: string | null;
  attendance16?: string | null;
  task1?: number | null;
  task2?: number | null;
  task3?: number | null;
  task4?: number | null;
  uts?: number | null;
  uas?: number | null;
  createdAt: string; // bisa diubah ke Date kalau parsing otomatis
  updatedAt: string; // sama seperti di atas
}

interface UpdatePayload {
  [key: string]: string | number | null;
}

const PilihKelasDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [studentList, setStudentList] = useState<Student[]>([]);
  const [updates, setUpdates] = useState<Record<string, UpdatePayload>>({});
  const [matkulId, setMatkulId] = useState("");
  const [kelasId, setKelasId] = useState("");
  const [kelasName, setKelasName] = useState("");

  useEffect(() => {
    setMatkulId(localStorage.getItem("MatkulId") || "");
    setKelasId(localStorage.getItem("KelasId") || "");
    setKelasName(localStorage.getItem("KelasName") || "");
  }, []);

  // API Services
  const getStudent = async () => {
    const res = await api.get(
      `/manage-lectures/courses/${matkulId}/class/${kelasId}`
    );
    return res.data.data;
  };
  const UpdateStudent = async (id: string, data: Partial<Course>) => {
    const res = await api.put(
      `/manage-lectures/courses/studyplancourse/${id}`,
      data
    );
    return res.data;
  };

  const handleChange = (
    courseId: string,
    field: string,
    value: string | number | null
  ) => {
    setUpdates((prev) => {
      const updatedCourse = {
        ...prev[courseId],
        [field]: value,
      };

      // hitung ulang nilai akhir setelah ada perubahan
      const { totalNilai } = hitungNilai(
        studentList
          .flatMap((s) => s.studyPlan[0]?.courses)
          .find((c) => c.id === courseId)!,
        updatedCourse
      );

      updatedCourse.score = Number(totalNilai);

      return {
        ...prev,
        [courseId]: updatedCourse,
      };
    });
  };

  const handleSaveAll = async () => {
    try {
      const entries = Object.entries(updates);
      for (const [studentId, data] of entries) {
        await UpdateStudent(studentId, data); // pake fungsi API kamu
      }
      fetchStudent();
      alert("Semua data berhasil disimpan ✅");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data ❌");
    }
  };

  // ambil data awal
  useEffect(() => {
    const fetchAll = async () => {
      try {
        await fetchStudent();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [matkulId, kelasId]);

  const fetchStudent = async () => {
    try {
      const data = await getStudent();
      const sortedData = data.sort((a: Student, b: Student) =>
        a.name.localeCompare(b.name, "id", { sensitivity: "base" })
      );
      setStudentList(sortedData);
    } catch (err) {
      console.error("Gagal fetch student:", err);
    }
  };

  function hitungNilai(course: Course, updatesForStudent?: UpdatePayload) {
    // ambil data asli + override dari updates
    const data = { ...course, ...updatesForStudent };

    // absensi
    const hadirCount = Array.from({ length: 16 })
      .map((_, i) => data[`attendance${i + 1}` as keyof Course])
      .filter((status) => status === "Hadir").length;

    const nilaiAbsensi = (hadirCount / 16) * 100;

    // rata-rata tugas
    const tugasValues = [data.task1, data.task2, data.task3, data.task4].map(
      (t) => Number(t) || 0
    );

    const nilaiTugas =
      tugasValues.reduce((a, b) => a + b, 0) / tugasValues.length;

    const uts = Number(data.uts) || 0;
    const uas = Number(data.uas) || 0;

    // bobot
    const totalNilai =
      nilaiAbsensi * 0.1 + nilaiTugas * 0.3 + uts * 0.3 + uas * 0.3;

    let grade = "";
    if (totalNilai >= 86) grade = "A";
    else if (totalNilai >= 78) grade = "A-";
    else if (totalNilai >= 70) grade = "B";
    else if (totalNilai >= 62) grade = "B-";
    else if (totalNilai >= 54) grade = "C";
    else if (totalNilai >= 40) grade = "D";
    else grade = "E";

    return { totalNilai: totalNilai.toFixed(2), grade };
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.toLowerCase();
    const rows = document.querySelectorAll("#tableMahasiswa tr");
    rows.forEach((row) => {
      const nama = row.querySelector("td")?.textContent?.toLowerCase() || "";
      (row as HTMLElement).style.display = nama.includes(input) ? "" : "none";
    });
  };

  return (
    <Suspense>
      <section className="section">
        <div className="section-header">
          <h1>Akademik</h1>
        </div>

        <div className="section-body">
          <h2 className="section-title">Kelas {kelasName}</h2>
          <p className="section-lead">Silahkan mengisi absensi dan nilai</p>

          <div className="position-relative mb-4">
            <i
              className="fas fa-search position-absolute"
              style={{
                top: "50%",
                right: 15,
                transform: "translateY(-50%)",
                color: "#aaa",
              }}
            />
            <input
              type="text"
              id="searchMahasiswa"
              className="form-control pr-5"
              placeholder="Cari nama mahasiswa..."
              onChange={handleSearch}
            />
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
              <div className="table-responsive">
                <table className="table table-bordered text-center align-middle">
                  <thead className="table-light">
                    <tr>
                      <th rowSpan={2}>Nama Mahasiswa</th>
                      <th colSpan={16}>Absensi</th>
                      <th colSpan={4}>Tugas</th>
                      <th rowSpan={2}>UTS</th>
                      <th rowSpan={2}>UAS</th>
                      <th rowSpan={2}>Nilai Akhir</th>
                      <th rowSpan={2}>Huruf Mutu</th>
                    </tr>
                    <tr>
                      {[...Array(16)].map((_, i) => (
                        <th key={`absen${i}`}>{i + 1}</th>
                      ))}
                      {[...Array(4)].map((_, i) => (
                        <th key={`tugas${i}`}>{i + 1}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody id="tableMahasiswa">
                    {studentList.map((student, rowIndex) => {
                      // ambil course pertama (atau filter sesuai courseId matkul)
                      const course = student.studyPlan[0]?.courses[0];
                      const { totalNilai, grade } = hitungNilai(course);

                      return (
                        <tr key={student.id}>
                          <td>{student.name}</td>

                          {/* Absensi 16 pertemuan */}
                          {Array.from({ length: 16 }).map((_, i) => {
                            const attendanceKey = `attendance${
                              i + 1
                            }` as keyof Course;
                            const status = course?.[attendanceKey] as
                              | string
                              | null;

                            return (
                              <td key={`absen-${rowIndex}-${i}`}>
                                <AbsensiToggle
                                  defaultValue={status}
                                  onChange={(val) =>
                                    handleChange(course.id, attendanceKey, val)
                                  }
                                />
                              </td>
                            );
                          })}

                          {/* Tugas 4 kali (atau 8 kalau kamu mau extend) */}
                          {Array.from({ length: 4 }).map((_, i) => {
                            const taskKey = `task${i + 1}` as keyof Course;
                            const nilaiTugas = course?.[taskKey] ?? null;

                            return (
                              <td key={`tugas-${rowIndex}-${i}`}>
                                <input
                                  type="number"
                                  className="tugas form-control"
                                  min={0}
                                  max={100}
                                  defaultValue={nilaiTugas ?? ""}
                                  style={{ width: 80 }}
                                  onChange={(e) => {
                                    const val = Math.min(
                                      100,
                                      Math.max(0, Number(e.target.value))
                                    );
                                    handleChange(course.id, taskKey, val);
                                  }}
                                />
                              </td>
                            );
                          })}

                          <td>
                            <input
                              type="number"
                              className="uts form-control"
                              min={0}
                              max={100}
                              defaultValue={course?.uts ?? ""}
                              style={{ width: 80 }}
                              onChange={(e) => {
                                const val = Math.min(
                                  100,
                                  Math.max(0, Number(e.target.value))
                                );
                                handleChange(course.id, "uts", val);
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="uas form-control"
                              min={0}
                              max={100}
                              defaultValue={course?.uas ?? ""}
                              style={{ width: 80 }}
                              onChange={(e) => {
                                const val = Math.min(
                                  100,
                                  Math.max(0, Number(e.target.value))
                                );
                                handleChange(course.id, "uas", val);
                              }}
                            />
                          </td>
                          <td className="nilai-total">
                            <input
                              className="uas form-control"
                              disabled
                              value={totalNilai}
                              style={{ width: 80 }}
                              onChange={() => {
                                handleChange(course.id, "score", totalNilai);
                              }}
                            />
                          </td>
                          <td className="huruf-mutu fw-bold">{grade}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <button
                  className="btn btn-primary mt-2"
                  onClick={handleSaveAll}
                >
                  Simpan
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </Suspense>
  );
};

export default PilihKelasDashboard;
