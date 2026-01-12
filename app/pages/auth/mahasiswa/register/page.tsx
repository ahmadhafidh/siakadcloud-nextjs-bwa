"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/lib/axiosInstance";
import { AxiosError } from "axios";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  // state form
  const [studentNumber, setStudentNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentNumber || !password) {
      alert("Semua field wajib diisi");
      return;
    }

    try {
      const res = await api.post("/manage-students/register", {
        studentNumber,
        password,
      });

      // Hanya masuk sini kalau status 2xx
      if (res.data.success) {
        alert("Register Berhasil!");
        router.push("/pages/auth/mahasiswa/login");
      } else {
        alert(`Register gagal: ${res.data.message}`);
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        // ✅ baca pesan error dari server
        const data = err.response?.data as {
          success?: boolean;
          message?: string;
        };

        if (data?.message === "Password is already set") {
          alert("Akun sudah terdaftar, silakan login.");
          router.push("/pages/auth/mahasiswa/login");
        } else {
          alert("Gagal Register: " + (data?.message || err.message));
        }

        console.error("Gagal Register:", data || err);
      } else {
        console.error("Unknown error:", err);
        alert("Gagal Register: Terjadi kesalahan yang tidak diketahui");
      }
    }
  };

  return (
    <section className="section">
      <div className="container mt-5">
        <div className="row">
          <div className="col-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4">
            <div className="login-brand">
              <Link href="/">
                <img
                  src="/assets/img/stisla-fill.svg"
                  alt="logo"
                  width={100}
                  className="shadow-light rounded-circle"
                />
              </Link>
            </div>

            <div className="card card-primary">
              <div className="card-header">
                <h4>Register Mahasiswa</h4>
              </div>

              <div className="card-body">
                <form onSubmit={handleRegister}>
                  <div className="form-group">
                    <label htmlFor="email">NIM</label>
                    <input
                      id="studentNumber"
                      type="text"
                      className="form-control"
                      value={studentNumber}
                      onChange={(e) => setStudentNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      id="password"
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg btn-block"
                    >
                      Register
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="simple-footer">Copyright &copy; Stisla 2018</div>
          </div>
        </div>
      </div>
    </section>
  );
}
