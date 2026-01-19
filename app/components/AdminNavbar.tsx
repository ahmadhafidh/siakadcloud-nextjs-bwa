// app/components/AdminNavbar.tsx
"use client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const AdminNavbar = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [loginTimeAgo, setLoginTimeAgo] = useState<string>("");

  useEffect(() => {
    const storedEmail = Cookies.get("email") || null;
    setEmail(storedEmail);

    // ambil waktu login dari cookies
    let loginTime = Cookies.get("loginTime");
    if (!loginTime) {
      // kalau belum ada, set waktu login sekarang
      loginTime = new Date().toISOString();
      Cookies.set("loginTime", loginTime);
    }

    // fungsi untuk update waktu relative
    const updateTimeAgo = () => {
      setLoginTimeAgo(dayjs(loginTime).fromNow());
    };

    updateTimeAgo(); // set awal
    const interval = setInterval(updateTimeAgo, 60000); // update tiap menit

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    Object.keys(Cookies.get() || {}).forEach((cookieName) => {
      Cookies.remove(cookieName);
    });

    router.push("/pages/auth/admin/login");
  };

  // Fungsi toggle sidebar
  const toggleSidebar = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const width = window.innerWidth;

    if (width < 1030) {
      // mobile
      if (document.body.classList.contains("sidebar-show")) {
        document.body.classList.remove("sidebar-show");
        document.body.classList.add("sidebar-gone");
      } else {
        document.body.classList.add("sidebar-show");
        document.body.classList.remove("sidebar-gone");
      }
    } else {
      // desktop
      document.body.classList.toggle("sidebar-mini");
    }
  };

  // Setup responsive body class
  useEffect(() => {
    const setBodyClass = () => {
      const width = window.innerWidth;
      if (width < 1030) {
        document.body.classList.add("sidebar-gone");
        document.body.classList.remove("sidebar-mini", "sidebar-show");
      } else {
        document.body.classList.remove("sidebar-gone", "sidebar-show");
        // jangan otomatis tambahkan sidebar-mini di desktop
      }
    };

    setBodyClass(); // set saat mount
    window.addEventListener("resize", setBodyClass);

    return () => {
      window.removeEventListener("resize", setBodyClass);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg main-navbar">
      <form className="form-inline mr-auto">
        <ul className="navbar-nav mr-3">
          <li>
            <a
              href="#"
              onClick={toggleSidebar}
              data-toggle="sidebar"
              className="nav-link nav-link-lg"
            >
              <i className="fas fa-bars"></i>
            </a>
          </li>
        </ul>
      </form>
      <ul className="navbar-nav navbar-right">
        <li className="dropdown dropdown-list-toggle"></li>
        <li className="dropdown">
          <a
            href="#"
            data-toggle="dropdown"
            className="nav-link dropdown-toggle nav-link-lg nav-link-user"
          >
            <div className="d-sm-none d-lg-inline-block">
              Hi, {email ?? "Loading..."}
            </div>
          </a>
          <div className="dropdown-menu dropdown-menu-right">
            <div className="dropdown-title">
              Logged in {loginTimeAgo || "just now"}
            </div>
            <div className="dropdown-divider"></div>
            <a
              href="#"
              className="dropdown-item has-icon text-danger"
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
            >
              <i className="fas fa-sign-out-alt"></i> Logout
            </a>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default AdminNavbar;
