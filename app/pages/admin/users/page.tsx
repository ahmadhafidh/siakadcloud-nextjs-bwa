'use client';
import React, { useState, useEffect } from 'react';
import api from "@/app/lib/axiosInstance";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

// API Services
const getUser = async () => {
  const res = await api.get("/users");
  return res.data.data;
};
const addUser = async (data: {
  name?: string;
  email?: string;
  role?: string;
}) => {
  const res = await api.post("/users", data);
  return res.data;
};
const updateUser = async (
  id: string,
  data: {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
  }
) => {
  const res = await api.put(`/users/${id}`, data);
  return res.data;
};
const deleteUser = async (id: string) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};

const UsersPage = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); //update
  const [selectedUser, setSelectedUser] = useState<Partial<User>>({}); //update
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  }); //create
  const [userList, setUserList] = useState<User[]>([]); //getalldata / list all users

  //ambil data awal
  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const data = await getUser()
      setUserList(data)
    } catch (err) {
      console.error("Gagal fetch user:", err);
    }
  }

  //create
  const handleNewUserChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  }
  const handleAddNewUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const saved = await addUser(newUser);
      setUserList((prev) => [...prev, saved]);
      setNewUser({ name: "", email: "", password: "", role: "" });
      console.log(setNewUser);
      fetchUser();
    } catch (err) {
      console.error("Gagal tambah user:", err);
    }
  };

  //delete 
  const handleDelete = async(id: string) => {
    if (!confirm("Yakin hapus user ini?")) return;

    try {
      await deleteUser(id)
      setUserList((prev) => prev.filter((p) => p.id !== id));
      alert("User berhasil dihapus!");
    } catch (err: any) {
            // Cek apakah error karena foreign key constraint
      if (err.response?.data?.data?.error?.includes("Foreign key constraint")) {
        alert(
          "User tidak bisa dihapus karena masih memiliki data terkait (misal mahasiswa, jadwal, dll)."
        );
      } else {
        alert("Gagal hapus user: " + err.message);
      }
      console.error("Gagal hapus user:", err);
    }
  }

  //update
  // 1. buka popup modal + data
  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  // 4. close popup / modal 
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser({});
  };

  // 2. cek apakah ada perubahan data?
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSelectedUser((prev) => ({ ...prev, [name]: value }));
  };

  // 3. lakukan update data
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUser.id) return;

    try {
      const updated = await updateUser(selectedUser.id, {
        name: selectedUser.name ?? "",
        email: selectedUser.email ?? "",
        role: selectedUser.role ?? "",
      });

      setUserList((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      closeEditModal();
      fetchUser();
    } catch (err) {
      console.error("Gagal update user:", err);
    }
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
                    <form onSubmit={handleAddNewUser}>
                      <div className="form-group">
                        <label>Nama User</label>
                        <input  
                          type="text"
                          className="form-control"
                          name="name"
                          placeholder="Nama User"
                          value={newUser.name}
                          onChange={handleNewUserChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="text"
                          className="form-control"
                          name="email"
                          placeholder="Email User"
                          value={newUser.email}
                          onChange={handleNewUserChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Password User</label>
                        <input
                          type="password"
                          className="form-control"
                          name="password"
                          placeholder="Password User"
                          value={newUser.password}
                          onChange={handleNewUserChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                          <label>Role</label>
                          <select
                            className="form-control"
                            name="role"
                            value={newUser.role} // pakai newProdi
                            onChange={handleNewUserChange}
                            required
                          >
                            <option key="choice" value="">
                              -- Pilih Role --
                            </option>
                            <option key="admin" value="admin">
                              admin
                            </option>
                            <option key="lecture" value="lecture">
                              lecture
                            </option>
                            <option key="student" value="student">
                              student
                            </option>
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
                      {userList.map((user, index) => (
                        <tr key={user.id}>
                          <td>{index + 1}</td>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.role}</td>
                          <td>
                            {new Date(user.createdAt).toLocaleDateString(
                              "id-ID",
                              {
                                weekday: "long",
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </td>
                          <td>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                openEditModal(user);
                              }}
                              className="btn btn-icon btn-primary mx-1"
                            >
                              <i className="far fa-edit"></i>
                            </button>
                            <a
                              href="#" 
                              className="btn btn-icon btn-danger"
                              onClick={(e) => {
                                e.preventDefault()
                                handleDelete(user.id)
                              }}
                            >
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
      {isEditModalOpen && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSave}>
                <div className="modal-header">
                  <h5 className="modal-title">Edit User</h5>
                  <button
                    type="button"
                    className="close"
                    onClick={closeEditModal}
                  >
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="fakultas">Nama User</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      placeholder="Nama User"
                      value={selectedUser.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="fakultas">Email User</label>
                    <input
                      type="text"
                      className="form-control"
                      name="email"
                      placeholder="Email User"
                      value={selectedUser.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="prodi">Role</label>
                    <select
                      className="form-control"
                      name="role"
                      value={selectedUser.role} 
                      onChange={handleInputChange}
                      required
                    >
                      <option key="choice" value="">
                        -- Pilih Role --
                      </option>
                      <option key="admin" value="admin">
                        admin
                      </option>
                      <option key="lecture" value="lecture">
                        lecture
                      </option>
                      <option key="student" value="student">
                        student
                      </option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary btn-danger"
                    onClick={closeEditModal}
                  >
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* End Modal Edit */}
    </section>
  );
};

export default UsersPage;
