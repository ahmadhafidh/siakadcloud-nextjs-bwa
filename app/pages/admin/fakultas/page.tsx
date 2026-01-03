'use client';
import api from "@/app/lib/axiosInstance"
import React, { useEffect, useState, useMemo } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";


// Komponen reusable
import DataTable from "@/app/components/table/DataTable";
import TableToolbar from "@/app/components/table/TableToolbar";
import TablePagination from "@/app/components/table/TablePagination";
import AddForm from "@/app/components/form/AddForm";
import ModalEditForm from "@/app/components/form/EditForm";

interface Fakultas {
  id: string, 
  name: string,
  code:string,
  createdAt: string
}

// API Services
const getFakultas = async () => {
  const res = await api.get("/faculties")
  console.log(res.data.data)
  return res.data.data;
}

const addFakultas = async (data: {name:string; code:string}) => {
  const res = await api.post("/faculties", data)
  return res.data
}

const updateFakultas = async (
  id: number,
  data: {name?: string; code?: string}
) => {
  const res = await api.put (`/faculties/${id}`, data)
  return res.data
}

const deleteFakultas = async (id:number) => {
  const res = await api.delete(`/faculties/${id}`)
  return res.data
}

const FakultasPage = () => {
  const [fakultasList, setFakultasList] = useState<Fakultas[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedFakultas, setSelectedFakultas] = useState<Fakultas | null>(
    null
  );
  
  // State input tambah/edit
  const [nama, setNama] = useState("")
  const [kode, setKode] = useState("")

  // State untuk search, sorting, pagination
  const[globalFilter, setGlobalFilter] = useState("")
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ]);

  // Generate kode otomatis dari nama
  const generateKode = (namaFakultas: string) => {
    if (!namaFakultas) return "";
    return namaFakultas
      .split(" ") // pisah per kata
      .map((kata) => kata[0]?.toUpperCase()) // ambil huruf pertama
      .join(""); // misal "FT" dari "Fakultas Teknik"
  };

  const handleNamaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNama(value);
    setKode(generateKode(value)) // otomatis update kode saat nama diubah
  }

  //ambil data awal
  useEffect(() => {
    fetchFakultas();
  }, [])

  const fetchFakultas = async () => {
    setLoading(true);
    const data = await getFakultas()
    setFakultasList(data)
    setLoading(false)
  }

  //tambah
  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault()
    await addFakultas({name: nama, code: kode})
    setNama("");
    setKode("");
    fetchFakultas();
  }

  // Edit
  const openEditModal = (fakultas:Fakultas) => {
    setSelectedFakultas(fakultas)
    setIsEditModalOpen(true);
  }
  
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedFakultas(null);
  }

  // const handleInputChange = async (e:React.FormEvent) => {
  //   e.preventDefault()
  //   if (selectedFakultas) {
  //     await updateFakultas(selectedFakultas.id, {
  //       name: selectedFakultas.name,
  //       code: selectedFakultas.code,
  //     });
  //     fetchFakultas();
  //     closeEditModal();
  //   }
  // }

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFakultas) {
      await updateFakultas(selectedFakultas.id, {
        name: selectedFakultas.name,
        code: selectedFakultas.code,
      });
      fetchFakultas();
      closeEditModal();
    }
  };


  // Hapus
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus fakultas ini")) return

    try {
      await deleteFakultas(id)
      setFakultasList((prev) => prev.filter((p) => p.id !== id));
      alert("Fakultas berhasil dihapus")
    } catch (err:any) {
      // Cek apakah error karena foreign key constraint
      if (err.response?.data?.data?.error?.includes("Foreign key constraint")) {
        alert(
          "Fakultas tidak bisa dihapus karena masih memiliki data terkait prodi."
        );
      } else {
        alert("Gagal hapus prodi: " + err.message);
      }
      console.error("Gagal hapus prodi:", err);
    }
    fetchFakultas();
  };

  // wrapper agar cocok dengan tipe onChange di FieldConfig
  // const handleNamaChangeWrapper = (
  //   e:
  //     | React.ChangeEvent<
  //       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  //     >
  //     | SelectOption
  //     | null
  // ) => {
  //   if (e && "target" in e) {
  //     handleNamaChange(e as React.ChangeEvent<HTMLInputElement>);
  //   }
  // }

  // Columns untuk TanStack Table
  const columns = useMemo<ColumnDef<Fakultas>[]>(
    () => [
      {
        accessorFn: (row, index) => index + 1,
        header: "#",
      },
      {
        accessorKey: "name",
        header: "Nama",
      },
      {
        accessorKey: "code",
        header: "Kode",
      },
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
          const fakultas = row.original; // data asli baris ini
          return (
            <>
              <a
                href="#"
                className="btn btn-icon btn-primary m-1"
                onClick={(e) => {
                  e.preventDefault();
                  openEditModal(fakultas);
                }}
              >
                <i className="far fa-edit"></i>
              </a>
              <a
                href="#"
                className="btn btn-icon btn-danger"
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete(fakultas.id);
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

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Inisialisasi table
  const table = useReactTable({
    data: fakultasList,
    columns,
    state: {
      pagination,
      globalFilter,
      sorting,
    },
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <section className="section">
      <div className="section-header">
        <h1>Master</h1>
        <div className="section-header-breadcrumb">
          <div className="breadcrumb-item">Master</div>
          <div className="breadcrumb-item">
            <a href="#">Fakultas</a>
          </div>
        </div>
      </div>

      <div className="section-body">
        <h2 className="section-title">Fakultas</h2>
        <p className="section-lead">
          Menampilkan semua data fakultas yang ada pada universitas ini
        </p>

        <div className="card">
          <div className="card-body">
            {/* Tambah Fakultas */}
            <button
              className="btn btn-primary btn-sm footer-left mb-2"
              type="button"
              data-toggle="collapse"
              data-target="#collapseTambahFakultas"
            >
              Tambah Fakultas
            </button>
            <div className="collapse" id="collapseTambahFakultas">
              <div className="card card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Nama Fakultas</label>
                    <input
                      type="text"
                      className="form-control"
                      value={nama}
                      onChange={handleNamaChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Kode</label>
                    <input
                      type="text"
                      className="form-control"
                      value={kode}
                      readOnly
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Simpan
                  </button>
                </form>
              </div>
            </div>

            {/* Search and Pagnation */}
            <div className="d-flex justify-content-between align-items-center mb-3 mt-2">
              {/* Dropdown "Show entries" */}
              <div className="dataTables_length">
                <label>
                  Show{" "}
                  <select
                    name="table-1_length"
                    aria-controls="table-1"
                    className="form-control form-control-sm d-inline-block"
                    style={{ width: "auto" }}
                    value={pagination.pageSize}
                    onChange={(e) =>
                      setPagination((old) => ({
                        ...old,
                        pageSize: Number(e.target.value),
                      }))
                    }
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>{" "}
                  entries
                </label>
              </div>

              {/* Search */}
              <div className="d-flex justify-content-between mb-3">
                <input
                  type="text"
                  placeholder="Search..."
                  className="form-control form-control-sm"
                  value={globalFilter ?? ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  style={{ width: "200px" }}
                />
              </div>
            </div>

            {/* Table */}
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          onClick={header.column.getToggleSortingHandler()}
                          style={{
                            cursor: header.column.getCanSort()
                              ? "pointer"
                              : "default",
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: <i className="fas fa-sort-up"></i>,
                            desc: <i className="fas fa-sort-down"></i>,
                          }[header.column.getIsSorted() as string] ?? null}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Edit */}
            {isEditModalOpen && selectedFakultas && (
              <div
                className="modal fade show"
                style={{
                  display: "block",
                  backgroundColor: "rgba(0,0,0,0.5)",
                }}
              >
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <form onSubmit={handleEditSave}>
                      <div className="modal-header">
                        <h5 className="modal-title">Edit Fakultas</h5>
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
                          <label>Nama Fakultas</label>
                          <input
                            type="text"
                            className="form-control"
                            value={selectedFakultas.name}
                            onChange={(e) =>
                              setSelectedFakultas({
                                ...selectedFakultas,
                                name: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Kode</label>
                          <input
                            type="text"
                            className="form-control"
                            value={selectedFakultas.code}
                            onChange={(e) =>
                              setSelectedFakultas({
                                ...selectedFakultas,
                                code: e.target.value,
                              })
                            }
                            required
                          />
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

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div>
                Page {pagination.pageIndex + 1} of {table.getPageCount()}
              </div>
              <ul className="pagination mb-0">
                {/* Previous */}
                <li
                  className={`paginate_button page-item previous ${
                    !table.getCanPreviousPage() ? "disabled" : ""
                  }`}
                  onClick={() => table.previousPage()}
                >
                  <a href="#" className="page-link">
                    Previous
                  </a>
                </li>

                {/* Nomor halaman */}
                {Array.from({ length: table.getPageCount() }, (_, i) => (
                  <li
                    key={i}
                    className={`paginate_button page-item ${
                      table.getState().pagination.pageIndex === i
                        ? "active"
                        : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      table.setPageIndex(i); // pindah langsung ke halaman i
                    }}
                  >
                    <a href="#" className="page-link">
                      {i + 1}
                    </a>
                  </li>
                ))}

                {/* Next */}
                <li
                  className={`paginate_button page-item next ${
                    !table.getCanNextPage() ? "disabled" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault(); // cegah reload halaman
                    if (table.getCanNextPage()) {
                      table.nextPage();
                    }
                  }}
                >
                  <a href="#" className="page-link">
                    Next
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FakultasPage;
