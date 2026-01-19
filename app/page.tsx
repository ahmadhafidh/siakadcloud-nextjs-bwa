"use client";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Stisla CSS */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/stisla/dist/css/style.css"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/stisla/dist/css/components.css"
      />

      <style jsx>{`
        body,
        html {
          height: 100%;
          margin: 0;
          font-family: "Nunito", sans-serif;
          background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .page-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
          background-color: rgba(102, 126, 234, 0.8); /* 0.8 = 80% opacity */
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          padding: 40px;
          text-align: center;
          max-width: 500px;
          width: 100%;
          animation: fadeInUp 0.8s ease forwards;
          opacity: 0;
          transform: translateY(20px);
        }

        .glass-card:nth-child(1) {
          animation-delay: 0.1s;
        }
        .glass-card:nth-child(2) {
          animation-delay: 0.2s;
        }
        .glass-card:nth-child(3) {
          animation-delay: 0.3s;
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        h1 {
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 10px;
        }

        p {
          color: #f8f9fa;
          margin-bottom: 30px;
        }

        .btn-role {
          width: 100%;
          padding: 15px 0;
          margin-bottom: 15px;
          font-weight: 600;
          font-size: 1rem;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .btn-role:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }

        .btn-admin {
          background: #667eea;
          color: white;
          border: none;
        }
        .btn-mahasiswa {
          background: #764ba2;
          color: white;
          border: none;
        }
        .btn-dosen {
          background: #ff7f50;
          color: white;
          border: none;
        }

        .footer-links {
          margin-top: 30px;
          display: flex;
          justify-content: center;
          gap: 15px;
          flex-wrap: wrap;
        }

        .footer-links a {
          text-decoration: none;
          color: rgba(255, 255, 255, 0.8);
          transition: all 0.3s ease;
        }

        .footer-links a:hover {
          color: white;
        }
      `}</style>

      <div className="page-wrapper">
        <div className="glass-card">
          <h1>Sistem Informasi Akademik</h1>
          <p>Pilih jenis login sesuai dengan peran Anda:</p>

          <Link href="/pages/auth/admin/login">
            <button className="btn-role btn-admin">👨‍💼 Login Admin</button>
          </Link>

          <Link href="/pages/auth/mahasiswa/login">
            <button className="btn-role btn-mahasiswa">
              👨‍🎓 Login Mahasiswa
            </button>
          </Link>

          <Link href="/pages/auth/dosen/login">
            <button className="btn-role btn-dosen ">👨‍🏫 Login Dosen</button>
          </Link>

          <div className="footer-links">
            <a
              href="https://stisla.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stisla Official
            </a>
            <a
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Next.js Docs
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
