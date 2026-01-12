"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/lib/axiosInstance";
import Cookies from "js-cookie";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [studentNumber, setStudentNumber] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/manage-students/login", {
        studentNumber,
        password,
      });
      Cookies.set("token", res.data.data.token, { expires: 1 });
      alert("Login Berhasil");
      router.push("/pages/mahasiswa/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        alert("Login gagal. Periksa studentNumber atau password!");
      } else {
        console.error("Unknown error:", err);
        alert("Login gagal. Terjadi kesalahan yang tidak diketahui.");
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
                <h4>Login Mahasiswa</h4>
              </div>

              <div className="card-body">
                <form
                  onSubmit={handleLogin}
                  className="needs-validation"
                  noValidate
                >
                  <div className="form-group">
                    <label htmlFor="email">Student Number</label>
                    <input
                      id="text"
                      type="text"
                      className="form-control"
                      name="studentNumber"
                      required
                      autoFocus
                      value={studentNumber}
                      onChange={(e) => setStudentNumber(e.target.value)}
                    />
                    <div className="invalid-feedback">
                      Please fill in your studentNumber
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="d-block">
                      <label htmlFor="password" className="control-label">
                        Password
                      </label>
                      <div className="float-right">
                        <a href="/auth/forgot-password" className="text-small">
                          Forgot Password?
                        </a>
                      </div>
                    </div>
                    <input
                      id="password"
                      type="password"
                      className="form-control"
                      name="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="invalid-feedback">
                      Please fill in your password
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        id="remember-me"
                        className="custom-control-input"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="remember-me"
                      >
                        Remember Me
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg btn-block"
                    >
                      Login
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="mt-5 text-muted text-center">
              Don&apos;t have an account?
              <a href="/pages/auth/mahasiswa/register">Create One</a>
            </div>

            <div className="simple-footer">Copyright &copy; Stisla 2018</div>
          </div>
        </div>
      </div>
    </section>
  );
}
