'use client';
import { useState } from 'react';

const MahasiswaPembayaran = () => {
  const [isPaid, setIsPaid] = useState(false);

  const handlePayment = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsPaid(true);
  };

  return (
    <section className="section">
      <div className="section-header">
        <h1>Pembayaran</h1>
      </div>

      <div className="section-body">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                {!isPaid && (
                  <>
                    <section
                      className="hero bg-warning text-dark py-3 mb-4 rounded shadow-sm"
                      id="hero-ukt"
                    >
                      <div className="hero-inner text-center">
                        <h5>Periode pembayaran UKT Tahun Ajaran 2025/2026</h5>
                        <p className="lead">
                          Silahkan untuk melakukan pembayaran ukt terlebih dahulu agar anda dapat
                          mengajukan kartu rencarana studi
                        </p>
                      </div>
                    </section>

                    <div className="table-responsive">
                      <table className="table table-striped" id="uktTable">
                        <thead>
                          <tr>
                            <th>Nama</th>
                            <th>NIM</th>
                            <th>Semester</th>
                            <th>Kelas</th>
                            <th>Program Studi</th>
                            <th>Fakultas</th>
                            <th>Golongan</th>
                            <th>Total Tagihan</th>
                            <th>Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Ujang Maman</td>
                            <td>20351839</td>
                            <td>1</td>
                            <td>IF-1A</td>
                            <td>Teknik Informatika</td>
                            <td>Fakultas Teknik</td>
                            <td>V</td>
                            <td>Rp 5.000.000,-</td>
                            <td>
                              <a href="#" className="btn btn-danger" onClick={handlePayment}>
                                Bayar
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                <div className="table-responsive mt-4">
                  <table className="table table-striped" id="table-1">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Kode Pembayaran</th>
                        <th>Golongan</th>
                        <th>Tahun Ajaran</th>
                        <th>Semester</th>
                        <th>Status</th>
                        <th>Dibuat Pada</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isPaid ? (
                        <tr>
                          <td>1</td>
                          <td>INV-20250407-001</td>
                          <td>V</td>
                          <td>2025/2026</td>
                          <td>1</td>
                          <td>
                            <span className="badge badge-success">Sukses</span>
                          </td>
                          <td>{new Date().toLocaleDateString()}</td>
                        </tr>
                      ) : (
                        <tr>
                          <td colSpan={7} className="text-center">
                            Belum ada pembayaran baru.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MahasiswaPembayaran;
