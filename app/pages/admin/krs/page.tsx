
import React from 'react';
import MyBarChart from '../../../components/myBarChart';

const KRSPage = () => {
  return (
    <section className="section">
      <div className="section-header">
        <h1>Kartu Rencana Studi</h1>
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
                        <th>Tahun Ajaran</th>
                        <th>Status</th>
                        <th>Dibuat pada</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>Ujang Maman</td>
                        <td>1234567890</td>
                        <td>2025/2026</td>
                        <td><span className="badge badge-success">Disetujui</span></td>
                        <td>2024-08-01</td>
                        <td>
                          <a href="#" className="btn btn-icon btn-primary" id="modal-1">
                            <i className="fa fa-eye"></i>
                          </a>
                        </td>
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

export default KRSPage;
