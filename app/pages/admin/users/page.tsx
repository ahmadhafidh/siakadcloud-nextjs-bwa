"use client";
import React, { useState, useEffect, useMemo } from "react";

import api from "@/app/lib/axiosInstance";

import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { BarLoader } from "react-spinners";

// Komponen reusable
import DataTable from "@/app/components/table/DataTable";
import TableToolbar from "@/app/components/table/TableToolbar";
import TablePagination from "@/app/components/table/TablePagination";
import ModalEditForm from "@/app/components/form/EditForm";
import AddForm from "@/app/components/form/AddForm";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Option {
  label: string;
  value: string;
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
const roleOptions = [
  { label: "admin", value: "admin" },
  { label: "lecture", value: "lecture" },
  { label: "student", value: "student" },
];

const UserPage = () => {
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Partial<User>>({});
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [userList, setUserList] = useState<User[]>([]);

  // State untuk search, sorting, pagination
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // ambil data awal
  useEffect(() => {
    const fetchAll = async () => {
      try {
        await fetchUser();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const fetchUser = async () => {
    try {
      const data = await getUser();
      const sortedData = data.sort((a: User, b: User) =>
        a.name.localeCompare(b.name, "id", { sensitivity: "base" })
      );
      setUserList(sortedData);
    } catch (err) {
      console.error("Gagal fetch user:", err);
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser({});
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSelectedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewUserChange = (label: string, value: string) => {
    setNewUser((prev) => ({ ...prev, [label]: value }));
  };

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

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus user ini?")) return;

    try {
      await deleteUser(id);
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
  };

  // Columns untuk tabel
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorFn: (row, index) => index + 1,
        header: "#",
      },
      { accessorKey: "name", header: "Name" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "role", header: "Role" },
      {
        accessorKey: "createdAt",
        header: "Dibuat pada",
        cell: (info) =>
          new Date(info.getValue() as string).toLocaleDateString("id-ID", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
          }),
      },
      {
        header: "Aksi",
        cell: ({ row }) => {
          const prodi = row.original;
          return (
            <>
              <a
                href="#"
                className="btn btn-icon btn-primary m-1"
                onClick={(e) => {
                  e.preventDefault();
                  openEditModal(prodi);
                }}
              >
                <i className="far fa-edit"></i>
              </a>
              <a
                href="#"
                className="btn btn-icon btn-danger"
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete(prodi.id);
                }}
              >
                <i className="fa fa-trash"></i>
              </a>
            </>
          );
        },
      },
    ],
    []
  );

  // Inisialisasi react-table
  const table = useReactTable({
    data: userList,
    columns,
    state: { pagination, globalFilter, sorting },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <>
      <section className="section">
        <div className="section-header">
          <h1>Master</h1>
          <div className="section-header-breadcrumb">
            <div className="breadcrumb-item">Mater</div>
            <div className="breadcrumb-item">
              <a href="/admin/akademik/jadwal">User Admin</a>
            </div>
          </div>
        </div>

        <div className="section-body">
          <h2 className="section-title">User Admin</h2>
          <p className="section-lead">
            Menampilkan semua data administrator pada universitas ini
          </p>
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <button
                    className="btn btn-primary btn-sm footer-left mb-2"
                    type="button"
                    data-toggle="collapse"
                    data-target="#collapseEditMatkul"
                  >
                    Tambah User
                  </button>
                  <div className="collapse" id="collapseEditMatkul">
                    <div className="card card-body">
                      {/* Add Form */}
                      <AddForm
                        onSubmit={handleAddNewUser}
                        collapseTargetId="collapseEditMatkul"
                        fields={[
                          {
                            label: "Nama User",
                            name: "name",
                            type: "text",
                            placeholder: "Masukkan Nama User",
                            value: newUser?.name,
                            onChange: (e: any) =>
                              handleNewUserChange("name", e.target.value),
                          },
                          {
                            label: "Email",
                            name: "email",
                            type: "text",
                            placeholder: "Masukkan Email",
                            value: newUser?.email,
                            onChange: (e: any) =>
                              handleNewUserChange("email", e.target.value),
                          },
                          {
                            label: "Password",
                            name: "password",
                            type: "text",
                            placeholder: "Masukkan Password",
                            value: newUser?.password,
                            onChange: (e: any) =>
                              handleNewUserChange("password", e.target.value),
                          },
                          {
                            label: "Role",
                            name: "role",
                            type: "asyncSelect",
                            placeholder: "Pilih Role",
                            value: newUser.role,
                            onChange: (opt: any) =>
                              handleNewUserChange(
                                "role",
                                opt ? opt.value : "admin"
                              ),
                            options: roleOptions.map((f) => ({
                              label: f.label,
                              value: f.value,
                            })),
                            loadOptions: async (inputValue: string) => {
                              // bisa filter dari fakultasList lokal
                              return roleOptions
                                .filter((f) =>
                                  f.label
                                    .toLowerCase()
                                    .includes(inputValue.toLowerCase())
                                )
                                .map((f) => ({
                                  label: f.label,
                                  value: f.value,
                                }));
                            },
                          },
                        ]}
                      />
                    </div>
                  </div>
                  {loading ? (
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{ minHeight: "300px" }}
                    >
                      <BarLoader color="#6777ef" />
                    </div>
                  ) : (
                    <>
                      <TableToolbar
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                        pageSize={pagination.pageSize}
                        setPageSize={(size) =>
                          setPagination((old) => ({ ...old, pageSize: size }))
                        }
                      />
                      <DataTable table={table} />
                      <TablePagination table={table} />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Edit Form */}
      <ModalEditForm
        title="Edit Program Studi"
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSubmit={handleSave}
        fields={[
          {
            label: "Nama User",
            name: "name",
            type: "text",
            placeholder: "Masukkan Nama User",
            value: selectedUser.name ?? "",
            onChange: (e) => {
              if (e && "target" in e) {
                setSelectedUser((prev) => ({
                  ...prev,
                  name: e.target.value, // aman
                }));
              }
            },
          },
          {
            label: "Email",
            name: "email",
            type: "text",
            placeholder: "Masukkan Email",
            value: selectedUser.email ?? "",
            onChange: (e) => {
              if (e && "target" in e) {
                setSelectedUser((prev) => ({
                  ...prev,
                  email: e.target.value, // aman
                }));
              }
            },
          },
          {
            label: "Role",
            name: "role",
            type: "asyncSelect",
            placeholder: "Masukkan Role",
            value: selectedUser.role ?? "",
            onChange: (opt) =>
              setSelectedUser((prev) => ({
                ...prev,
                role: (opt as Option)?.value || "", // simpan id
              })),
            options: roleOptions.map((f) => ({
              label: f.label,
              value: f.value,
            })),
            loadOptions: async (inputValue: string) => {
              // bisa filter dari fakultasList lokal
              return roleOptions
                .filter((f) =>
                  f.label.toLowerCase().includes(inputValue.toLowerCase())
                )
                .map((f) => ({ label: f.label, value: f.value }));
            },
          },
        ]}
        submitText="Simpan"
        cancelText="Batal"
      />
    </>
  );
};

export default UserPage;
