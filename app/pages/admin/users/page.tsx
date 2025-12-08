'use client';
import React, { useState } from 'react';

type Users = {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

const initialUsersData: Users[] = [
  {
    id: 1,
    name: 'Gilang',
    email: 'gilang@gmail.com',
    role: 'Admin',
    createdAt: 'Rabu, 12 Januari 2025',
  },
];

const UsersPage = () => {
  const [UsersList, setUsersList] = useState<Users[]>(initialUsersData);
  const [selectedUsers, setSelectedUsers] = useState<Users | null>(null);

  const handleEditClick = (users: Users) => {
    setSelectedUsers(users);
    const modal = new (window as any).bootstrap.Modal(document.getElementById('editUsersModal'));
    modal.show();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedUsers) return;
    setSelectedUsers({
      ...selectedUsers,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    if (!selectedUsers) return;
    setUsersList(prev =>
      prev.map(p => (p.id === selectedUsers.id ? selectedUsers : p))
    );
    const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('editUsersModal'));
    modal.hide();
  };

  return (
    <section className="section">
      <div className="section-header">
        <h1>Master</h1>
        <div className="section-header-breadcrumb">
          <div className="breadcrumb-item">Master</div>
          <div className="breadcrumb-item">
            <a href="../master/users.html">Users</a>
          </div>
        </div>
      </div>

      <div className="section-body">
        <h2 className="section-title">Users</h2>
        <p className="section-lead">Menampilkan semua data Users yang ada pada universitas ini</p>

        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <button
                  className="btn btn-primary btn-sm footer-left mb-2"
                  type="button"
                  data-toggle="collapse"
                  data-target="#collapseEditUsers"
                >
                  Tambah User
                </button>
                <div className="collapse" id="collapseEditUsers">
                  <div className="card card-body">
                    <form>
                      <div className="form-group">
                        <label>Nama</label>
                        <input type="text" className="form-control" placeholder="Nama" />
                      </div>
                      <div className="form-group">
                        <label>Email</label>
                        <input type="text" className="form-control" placeholder="Email" />
                      </div>
                      <div className="form-group">
                        <label>Password</label>
                        <input type="text" className="form-control" placeholder="Password" />
                      </div>
                      <div className="form-group">
                          <label>Role</label>
                          <select className="form-control" name="role">
                            <option>--Pilih Role--</option>
                            <option>Admin</option>
                            <option>Mahasiswa</option>
                            <option>Dosen</option>
                          </select>
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
                        <th>Email</th>
                        <th>Role</th>
                        <th>Dibuat pada</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {UsersList.map((users, index) => (
                        <tr key={users.id}>
                          <td>{index + 1}</td>
                          <td>{users.name}</td>
                          <td>{users.email}</td>
                          <td>{users.role}</td>
                          <td>{users.createdAt}</td>
                          <td>
                            <button
                              onClick={() => handleEditClick(users)}
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

      {/* Modal Edit Users */}
      <div
        className="modal fade"
        id="editUsersModal"
        tabIndex={-1}
        aria-labelledby="editUsersModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editUsersModalLabel">Edit Users</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            {selectedUsers && (
              <div className="modal-body">
                <div className="form-group">
                  <label>Nama</label>
                  <input
                    className="form-control"
                    name="name"
                    value={selectedUsers.name}
                    onChange={handleChange}
                  />
                </div>
                  <div className="form-group">
                  <label>Email</label>
                  <input
                    className="form-control"
                    name="email"
                    value={selectedUsers.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                    <label>--Pilih Role--</label>
                    <select className="form-control">
                      <option>Admin</option>
                      <option>Mahasiswa</option>
                      <option>Dosen</option>
                    </select>
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

export default UsersPage;
