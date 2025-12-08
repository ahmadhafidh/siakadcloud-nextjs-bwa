'use client';
import React from 'react';

const PilihKelasDashboard = () => {
  const hitungNilai = () => {
    const row = document.querySelector("tbody tr") as HTMLTableRowElement;
    const absensi = row.querySelectorAll<HTMLInputElement>(".absen");
    const tugas = row.querySelectorAll<HTMLInputElement>(".tugas");
    const uts = parseFloat((row.querySelector(".uts") as HTMLInputElement)?.value) || 0;
    const uas = parseFloat((row.querySelector(".uas") as HTMLInputElement)?.value) || 0;

    let hadir = 0;
    absensi.forEach(a => { if (a.checked) hadir++; });

    let totalTugas = 0;
    tugas.forEach(t => totalTugas += parseFloat(t.value) || 0);

    const nilaiAbsensi = (hadir / 16) * 100;
    const nilaiTugas = totalTugas / 8;

    const totalNilai = (nilaiAbsensi * 0.1) + (nilaiTugas * 0.3) + (uts * 0.3) + (uas * 0.3);

    let grade = "";
    if (totalNilai >= 86) grade = "A";
    else if (totalNilai >= 78) grade = "A-";
    else if (totalNilai >= 70) grade = "B";
    else if (totalNilai >= 62) grade = "B-";
    else if (totalNilai >= 54) grade = "C";
    else if (totalNilai >= 40) grade = "D";
    else grade = "E";

    (row.querySelector(".nilai-total") as HTMLElement).innerText = totalNilai.toFixed(2);
    (row.querySelector(".huruf-mutu") as HTMLElement).innerText = grade;
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.toLowerCase();
    const rows = document.querySelectorAll("#tableMahasiswa tr");
    rows.forEach(row => {
      const nama = row.querySelector("td")?.textContent?.toLowerCase() || "";
      (row as HTMLElement).style.display = nama.includes(input) ? "" : "none";
    });
  };

  return (
    <section className="section">
      <div className="section-header">
        <h1>Akademik</h1>
      </div>

      <div className="section-body">
        <h2 className="section-title">Kelas IF-1A</h2>
        <p className="section-lead">Silahkan mengisi absensi dan nilai</p>

        <div className="position-relative mb-4">
          <i className="fas fa-search position-absolute" style={{ top: "50%", right: 15, transform: "translateY(-50%)", color: "#aaa" }} />
          <input
            type="text"
            id="searchMahasiswa"
            className="form-control pr-5"
            placeholder="Cari nama mahasiswa..."
            onChange={handleSearch}
          />
        </div>

        <div className="table-responsive">
          <table className="table table-bordered text-center align-middle">
            <thead className="table-light">
              <tr>
                <th rowSpan={2}>Nama Mahasiswa</th>
                <th colSpan={16}>Absensi</th>
                <th colSpan={8}>Tugas</th>
                <th rowSpan={2}>UTS</th>
                <th rowSpan={2}>UAS</th>
                <th rowSpan={2}>Nilai Akhir</th>
                <th rowSpan={2}>Huruf Mutu</th>
              </tr>
              <tr>
                {[...Array(16)].map((_, i) => <th key={`absen${i}`}>{i + 1}</th>)}
                {[...Array(8)].map((_, i) => <th key={`tugas${i}`}>{i + 1}</th>)}
              </tr>
            </thead>
            <tbody id="tableMahasiswa">
              {["Andi Wijaya", "Budi Santoso"].map((nama, index) => (
                <tr key={index}>
                  <td>{nama}</td>
                  {[...Array(16)].map((_, i) => (
                    <td key={`absen-${index}-${i}`}><input type="checkbox" className="absen" /></td>
                  ))}
                  {[...Array(8)].map((_, i) => (
                    <td key={`tugas-${index}-${i}`}>
                      <input type="number" className="tugas form-control" min={0} max={100} style={{ width: 80 }} />
                    </td>
                  ))}
                  <td><input type="number" className="uts form-control" min={0} max={100} style={{ width: 80 }} /></td>
                  <td><input type="number" className="uas form-control" min={0} max={100} style={{ width: 80 }} /></td>
                  <td className="nilai-total"></td>
                  <td className="huruf-mutu fw-bold"></td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="btn btn-primary mt-2" onClick={hitungNilai}>Simpan</button>
        </div>
      </div>
    </section>
  );
};

export default PilihKelasDashboard;

