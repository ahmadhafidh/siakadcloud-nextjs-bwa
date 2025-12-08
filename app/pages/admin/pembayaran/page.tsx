
import React from 'react';
import MyBarChart from '../../../components/myBarChart';

const PembayaranPage = () => {
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
                <div className="table-responsive">
                  <table className="table table-striped" id="table-1">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Nama</th>
                        <th>NIM</th>
                        <th>Kode Pembayaran</th>
                        <th>Golongan</th>
                        <th>Tahun Ajaran</th>
                        <th>Semester</th>
                        <th>Status</th>
                        <th>Dibuat Pada</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>Ujang Maman</td>
                        <td>20351839</td>
                        <td>PMB2025001</td>
                        <td>Reguler A</td>
                        <td>2025/2026</td>
                        <td>1</td>
                        <td><span className="badge badge-success">Lunas</span></td>
                        <td>Senin, 01 April 2025</td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>Ujang Maman</td>
                        <td>20351839</td>
                        <td>PMB2025002</td>
                        <td>Reguler A</td>
                        <td>2025/2026</td>
                        <td>2</td>
                        <td><span className="badge badge-warning">Belum Lunas</span></td>
                        <td>Selasa, 02 April 2025</td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td>Ujang Maman</td>
                        <td>20351839</td>
                        <td>PMB2025003</td>
                        <td>Reguler A</td>
                        <td>2024/2025</td>
                        <td>2</td>
                        <td><span className="badge badge-info">Ditangguhkan</span></td>
                        <td>Rabu, 03 April 2025</td>
                      </tr>
                      <tr>
                        <td>4</td>
                        <td>Ujang Maman</td>
                        <td>20351839</td>
                        <td>PMB2025004</td>
                        <td>Reguler A</td>
                        <td>2024/2025</td>
                        <td>1</td>
                        <td><span className="badge badge-danger">Tunggakan</span></td>
                        <td>Kamis, 04 April 2025</td>
                      </tr>
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

export default PembayaranPage;
