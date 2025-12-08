'use client';
import React from 'react';

const PilihMatkulDashboard = () => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
      const title = card.querySelector(".card-header h4")?.textContent?.toLowerCase() || "";
      const parent = card.closest(".col-4") as HTMLElement;
      if (parent) {
        parent.style.display = title.includes(query) ? "block" : "none";
      }
    });
  };

  const kelas = ["IF-1A", "IF-1B", "IF-1C"];

  return (
    <section className="section">
      <div className="section-header">
        <h1>Akademik</h1>
      </div>

      <div className="section-body">
        <h2 className="section-title">Pilih Kelas</h2>
        <p className="section-lead">
          Semua kelas Algoritma dan Pemrograman yang anda ampu
        </p>

        <div className="position-relative mb-4">
          <i className="fas fa-search position-absolute" style={{ top: "50%", left: 15, transform: "translateY(-50%)", color: "#aaa" }} />
          <input
            type="text"
            id="searchInput"
            className="form-control pl-5"
            placeholder="Cari kelas..."
            onChange={handleSearch}
          />
        </div>

        <div className="row">
          {kelas.map((namaKelas, index) => (
            <div className="col-4" key={index}>
              <a href="/pages/dosen/pilihkelas" className="text-decoration-none text-dark">
                <div className="card card-statistic-1" style={{ cursor: "pointer" }}>
                  <div className="card-icon bg-primary">
                    <i className="fa fa-chalkboard-teacher" style={{ color: "white", fontSize: 20 }}></i>
                  </div>
                  <div className="card-wrap">
                    <div className="card-header">
                      <h4>Teknik Informatika - Algoritma dan Pemrograman</h4>
                    </div>
                    <div className="card-body">
                      {namaKelas}
                    </div>
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
