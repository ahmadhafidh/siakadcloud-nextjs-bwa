'use client';
import React, { useState } from 'react';
import Image from 'next/image';

const PilihKelasPage = () => {
  const mahasiswaOptions = [
    { value: '1', name: 'Agus Pratama', nim: '2021001', img: '/assets/img/avatar/avatar-5.png' },
    { value: '2', name: 'Andini Anjani', nim: '2021002', img: '/assets/img/avatar/avatar-5.png' },
    { value: '3', name: 'Citra Dewi', nim: '2021003', img: '/assets/img/avatar/avatar-5.png' },
    { value: '4', name: 'Doni Hidayat', nim: '2021004', img: '/assets/img/avatar/avatar-5.png' },
  ];

  const mahasiswaGrid = Array.from({ length: 20 }, (_, index) => ({
    id: index + 1,
    nama: '',
    nim: '',
    img: '',
    bgClass: 'bg-light',
    textClass: '',
  }));

  const [grid, setGrid] = useState(mahasiswaGrid);

  const handleSelectMahasiswa = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    if (!selectedValue) return;

    const selectedMahasiswa = mahasiswaOptions.find(
      (mhs) => mhs.value === selectedValue
    );

    if (selectedMahasiswa) {
      setGrid((prevGrid) => {
        const updatedGrid = [...prevGrid];
        const firstEmptySpot = updatedGrid.find((item) => item.nama === '');

        if (firstEmptySpot) {
          const index = updatedGrid.indexOf(firstEmptySpot);
          updatedGrid[index] = {
            ...firstEmptySpot,
            nama: selectedMahasiswa.name,
            nim: selectedMahasiswa.nim,
            img: selectedMahasiswa.img,
            bgClass: 'bg-primary',
            textClass: 'text-white',
          };
        }

        return updatedGrid;
      });
    }
  };

  return (
    <section className="section">
      <div className="section-header">
        <h1>Master</h1>
        <div className="section-header-breadcrumb">
          <div className="breadcrumb-item">Master</div>
          <div className="breadcrumb-item">
            <a href="../master/kelas.html">Kelas</a>
          </div>
        </div>
      </div>

      <div className="section-body">
        <h2 className="section-title">Kelas A</h2>
        <p className="section-lead">Menampilkan semua data mahasiswa yang bersedia pada kelas ini</p>

        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h5>Mahasiswa</h5>
                <select
                  id="mahasiswa"
                  className="form-control mb-4"
                  style={{ width: '100%' }}
                  onChange={handleSelectMahasiswa}
                >
                  <option value="">-- Pilih Mahasiswa --</option>
                  {mahasiswaOptions.map((mahasiswa) => (
                    <option
                      key={mahasiswa.value}
                      value={mahasiswa.value}
                    >
                      {mahasiswa.name}
                    </option>
                  ))}
                </select>

                {/* Grid 2x2 */}
                <div className="row text-center" id="mahasiswa-grid">
                  {grid.map((item, index) => (
                    <div key={index} className="col-3 mb-4 text-center">
                      <div
                        className={`border p-3 rounded kotak ${item.bgClass}`}
                        style={{ minHeight: '150px' }}
                      >
                        {item.img && (
                          <Image
                            src={item.img}
                            alt={`Foto Mahasiswa ${item.nama}`}
                            width={35}
                            height={35}
                            className="mb-2 rounded-circle d-block"
                          />
                        )}
                        <div className={item.textClass}>{item.nama || index + 1}</div>
                        <div className={item.textClass}>{item.nim || '-'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PilihKelasPage;
