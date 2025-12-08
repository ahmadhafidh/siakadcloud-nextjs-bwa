
import React from 'react';
import MyBarChart from '../../../components/myBarChart';

const GolUKTPage = () => {
  return (
    <section className="section">
      <div className="section-header">
        <h1>Pembayaran</h1>
        <div className="section-header-breadcrumb">
          <div className="breadcrumb-item">Pembayaran</div>
          <div className="breadcrumb-item">
            <a href="../pembayaran/golongan-ukt.html">Golongan Kuliah Tunggal</a>
          </div>
        </div>
      </div>

      <div className="section-body">
        <h2 className="section-title">Golongan UKT</h2>
        <p className="section-lead">
          Menampilkan semua data Golongan UKT yang ada pada universitas ini
        </p>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <button
                  className="btn btn-primary btn-sm footer-left mb-2"
                  type="button"
                  data-toggle="collapse"
                  data-target="#collapseEditGolonganUKT"
                >
                  Tambah Golongan UKT
                </button>
                <div className="collapse" id="collapseEditGolonganUKT">
                  <div className="card card-body">
                    <form>
                      <div className="form-group">
                        <label>Golongan</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Nama Golongan"
                        />
                      </div>
                      <div className="form-group">
                        <label>Jumlah</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Jumlah"
                        />
                      </div>
                      <button type="submit" className="btn btn-primary">
                        Simpan
                      </button>
                    </form>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table table-striped" id="table-1">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Golongan</th>
                        <th>Jumlah</th>
                        <th>Dibuat pada</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>Golongan I</td>
                        <td>Rp 500.000</td>
                        <td>2024-08-01</td>
                        <td>
                          <a href="#" className="btn btn-icon btn-primary">
                            <i className="far fa-edit"></i>
                          </a>
                          <a href="#" className="btn btn-icon btn-danger">
                            <i className="fa fa-trash"></i>
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>Golongan II</td>
                        <td>Rp 1.000.000</td>
                        <td>2024-08-02</td>
                        <td>
                          <a href="#" className="btn btn-icon btn-primary">
                            <i className="far fa-edit"></i>
                          </a>
                          <a href="#" className="btn btn-icon btn-danger">
                            <i className="fa fa-trash"></i>
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td>Golongan III</td>
                        <td>Rp 2.000.000</td>
                        <td>2024-08-03</td>
                        <td>
                          <a href="#" className="btn btn-icon btn-primary">
                            <i className="far fa-edit"></i>
                          </a>
                          <a href="#" className="btn btn-icon btn-danger">
                            <i className="fa fa-trash"></i>
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>4</td>
                        <td>Golongan IV</td>
                        <td>Rp 3.500.000</td>
                        <td>2024-08-04</td>
                        <td>
                          <a href="#" className="btn btn-icon btn-primary">
                            <i className="far fa-edit"></i>
                          </a>
                          <a href="#" className="btn btn-icon btn-danger">
                            <i className="fa fa-trash"></i>
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>5</td>
                        <td>Golongan V</td>
                        <td>Rp 5.000.000</td>
                        <td>2024-08-05</td>
                        <td>
                          <a href="#" className="btn btn-icon btn-primary">
                            <i className="far fa-edit"></i>
                          </a>
                          <a href="#" className="btn btn-icon btn-danger">
                            <i className="fa fa-trash"></i>
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

export default GolUKTPage;
