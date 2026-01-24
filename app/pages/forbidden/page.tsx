"use client";
import React from "react";

export default function ForbiddenPage() {
  // DEFAULT CONFIG (bukan props)
  const title = "403 - Akses Ditolak";
  const message = "Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.";
  const showHomeButton = true;

  const handleGoHome = () => {
    window.location.href = "/";
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <section className="section">
      <div className="container mt-5">
        <div className="page-error">
          <h1>403</h1>
          <h2>{title}</h2>
          <div className="page-description">{message}</div>

          <div className="page-search">
            <div className="alert alert-warning text-left mb-4">
              <i className="fas fa-info-circle mr-2"></i>
              Jika Anda merasa ini adalah kesalahan, silakan hubungi
              administrator sistem.
            </div>

            <div className="d-flex justify-content-center gap-2 flex-wrap">
              <button
                type="button"
                className="btn btn-success"
                onClick={handleGoBack}
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Kembali
              </button>

              {showHomeButton && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleGoHome}
                >
                  <i className="fas fa-home mr-2"></i>
                  Beranda
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
