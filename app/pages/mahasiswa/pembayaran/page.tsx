"use client";
import { useState, useEffect } from "react";
import api from "@/app/lib/axiosInstance";
import { BarLoader } from "react-spinners";

interface Pembayaran {
  id: string;
  code: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  student: Mahasiswa;
}

interface Mahasiswa {
  name: string;
  studentNumber: string;
  semester: number;
  class: {
    name: string; // className
    major: {
      name: string; // major
      faculty: {
        name: string; // faculty
      };
    };
  };
  tfGroup: {
    group: string;
    amount: number;
  };
}

// API Services
const getPembayaran = async () => {
  const res = await api.get("/manage-students/payment");
  return res.data.data;
};

const updatePembayaran = async (id: string) => {
  const res = await api.put(`/manage-students/payment/${id}`, {
    status: "PAID",
  });
  return res.data;
};

const MahasiswaPembayaran = () => {
  const [loading, setLoading] = useState(true);
  const [pembayaranList, setPembayaranList] = useState<Pembayaran[]>([]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute(
      "data-client-key",
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ""
    ); // Ganti dengan client key kamu
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // ambil data awal
  useEffect(() => {
    const fetchAll = async () => {
      try {
        await fetchPembayaran();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const fetchPembayaran = async () => {
    try {
      const data = await getPembayaran();
      setPembayaranList(data);
    } catch (err) {
      console.error("Gagal fetch KHS:", err);
    }
  };

  const handlePayment = async (id: string) => {
    try {
      const pembayaran = pembayaranList.find((p) => p.id === id);
      if (!pembayaran) return;
      
      const newCode =
        pembayaran.code.slice(0, -4) +
        String(Math.floor(Math.random() * 10000)).padStart(4, "0");

      const res = await fetch("/api/midtrans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: newCode,
          grossAmount: pembayaran.student.tfGroup.amount,
          customerName: pembayaran.student.name,
          email: "guest@example.com", // bisa diganti jika ada email asli
        }),
      });

      const { token } = await res.json();
      console.log("token", token);

      // @ts-expect-error belum di support
      window.snap.pay(token, {
        onSuccess: async function () {
          // Update status ke PAID setelah pembayaran berhasil
          await updatePembayaran(pembayaran.id);
          await fetchPembayaran(); // refresh data
          alert("Pembayaran berhasil!");
        },
        onPending: function () {
          alert("Pembayaran tertunda. Silakan selesaikan nanti.");
        },
        onError: function () {
          alert("Terjadi kesalahan saat pembayaran.");
        },
        onClose: function () {
          alert("Anda menutup popup sebelum menyelesaikan pembayaran.");
        },
      });
    } catch (err) {
      console.error("Gagal memproses pembayaran:", err);
      alert("Gagal memulai pembayaran.");
    }
  };

  const unpaidList = pembayaranList.filter((p) => p.status === "UNPAID");
  const paidList = pembayaranList.filter((p) => p.status === "PAID");

  return (
    <section className="section">
      <div className="section-header">
        <h1>Pembayaran</h1>
      </div>

      <div className="section-body">
        <div className="row">
          <div className="col-12">
            <div className="card">
              {loading ? (
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{ minHeight: "300px" }}
                >
                  <BarLoader color="#6777ef" />
                </div>
              ) : (
                <>
                  <div className="card-body">
                    {unpaidList.length > 0 && (
                      <>
                        <section
                          className="hero bg-warning text-dark py-3 mb-4 rounded shadow-sm"
                          id="hero-ukt"
                        >
                          <div className="hero-inner text-center">
                            <h5>
                              Periode pembayaran UKT Semester{" "}
                              {pembayaranList.length > 0 &&
                                pembayaranList[0].student.semester}
                            </h5>
                            <p className="lead">
                              Silahkan untuk melakukan pembayaran ukt terlebih
                              dahulu agar anda dapat mengajukan kartu rencarana
                              studi
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
                              {unpaidList.map((pembayaran) => (
                                <tr key={pembayaran.id}>
                                  <td>{pembayaran.student.name}</td>
                                  <td>{pembayaran.student.studentNumber}</td>
                                  <td>{pembayaran.student.semester}</td>
                                  <td>{pembayaran.student.class.name}</td>
                                  <td>{pembayaran.student.class.major.name}</td>
                                  <td>
                                    {
                                      pembayaran.student.class.major.faculty
                                        .name
                                    }
                                  </td>
                                  <td>{pembayaran.student.tfGroup.group}</td>
                                  <td>
                                    {new Intl.NumberFormat("id-ID", {
                                      style: "currency",
                                      currency: "IDR",
                                      minimumFractionDigits: 0,
                                    }).format(
                                      pembayaran.student.tfGroup.amount
                                    )}
                                  </td>
                                  <td>
                                    <a
                                      href="#"
                                      className="btn btn-danger"
                                      onClick={() =>
                                        handlePayment(pembayaran.id)
                                      }
                                    >
                                      Bayar
                                    </a>
                                  </td>
                                </tr>
                              ))}
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
                          {paidList.length > 0 ? (
                            paidList.map((p, idx) => (
                              <tr key={p.id}>
                                <td>{idx + 1}</td>
                                <td>{p.code}</td>
                                <td>{p.student.tfGroup.group}</td>
                                <td>2025/2026</td>
                                <td>{p.student.semester}</td>
                                <td>
                                  <span className="badge badge-success">
                                    {p.status}
                                  </span>
                                </td>
                                <td>
                                  {new Date(p.createdAt).toLocaleDateString()}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={7} className="text-center">
                                Belum ada pembayaran sukses.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MahasiswaPembayaran;
