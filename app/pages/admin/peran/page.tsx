'use client';
import React, { useState } from 'react';

type Peran = {
  id: number;
  name: string;
  guardName: string;
  createdAt: string;
};

const initialPeranData: Peran[] = [
  {
    id: 1,
    name: 'Admin',
    guardName: 'web',
    createdAt: 'Rabu, 12 Januari 2025',
  },
  {
    id: 2,
    name: 'Dosen',
    guardName: 'web',
    createdAt: 'Rabu, 12 Januari 2025',
  },
  {
    id: 3,
    name: 'Mahasiswa',
    guardName: 'web',
    createdAt: 'Rabu, 12 Januari 2025',
  },
];

const PeranPage = () => {
  const [peranList, setPeranList] = useState<Peran[]>(initialPeranData);
  const [selectedPeran, setSelectedPeran] = useState<Peran | null>(null);

  const handleEditClick = (peran: Peran) => {
    setSelectedPeran(peran);
    const modal = new (window as any).bootstrap.Modal(document.getElementById('editPeranModal'));
    modal.show();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedPeran) return;
    setSelectedPeran({
      ...selectedPeran,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    if (!selectedPeran) return;
    setPeranList(prev =>
      prev.map(p => (p.id === selectedPeran.id ? selectedPeran : p))
    );
    const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('editPeranModal'));
    modal.hide();
  };

  return (
    <section className="section">
      <div className="section-header">
        <h1>Master</h1>
        <div className="section-header-breadcrumb">
          <div className="breadcrumb-item">Master</div>
          <div className="breadcrumb-item">
            <a href="../master/peran.html">Peran</a>
          </div>
        </div>
      </div>

      <div className="section-body">
        <h2 className="section-title">Peran</h2>
        <p className="section-lead">Menampilkan semua data Peran yang ada pada universitas ini</p>

        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <button
                  className="btn btn-primary btn-sm footer-left mb-2"
                  type="button"
                  data-toggle="collapse"
                  data-target="#collapseEditPeran"
                >
                  Tambah Peran
                </button>
                <div className="collapse" id="collapseEditPeran">
                  <div className="card card-body">
                    <form>
                      <div className="form-group">
                        <label>Nama Peran</label>
                        <input type="text" className="form-control" placeholder="Nama Peran" />
                      </div>
                      <div className="form-group">
                        <label>Guard Name</label>
                        <input type="text" className="form-control" placeholder="Guard Name" />
                      </div>
                      <button type="submit" className="btn btn-primary">Simpan</button>
                    </form>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table table-striped" id="table-1">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Guard Name</th>
                        <th>Dibuat pada</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {peranList.map((peran, index) => (
                        <tr key={peran.id}>
                          <td>{index + 1}</td>
                          <td>{peran.name}</td>
                          <td>{peran.guardName}</td>
                          <td>{peran.createdAt}</td>
                          <td>
                            <button
                              onClick={() => handleEditClick(peran)}
                              className="btn btn-icon btn-primary mx-1"
                            >
                              <i className="far fa-edit"></i>
                            </button>
                            <a href="#" className="btn btn-icon btn-danger">
                              <i className="fa fa-trash"></i>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Edit Peran */}
      <div
        className="modal fade"
        id="editPeranModal"
        tabIndex={-1}
        aria-labelledby="editPeranModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editPeranModalLabel">Edit Peran</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            {selectedPeran && (
              <div className="modal-body">
                <div className="form-group">
                  <label>Nama Peran</label>
                  <input
                    className="form-control"
                    name="name"
                    value={selectedPeran.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Guard Name</label>
                  <input
                    className="form-control"
                    name="guardName"
                    value={selectedPeran.guardName}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Tutup
              </button>
              <button
                onClick={handleSave}
                className="btn btn-primary"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* End Modal Edit */}
    </section>
  );
};

export default PeranPage;
