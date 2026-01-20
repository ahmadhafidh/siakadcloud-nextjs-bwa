"use client";
import React, { useEffect, useState } from "react";
import api from "@/app/lib/axiosInstance";
import AdminStatCards from "@/app/components/card/AdminStatCard";
import { BarLoader } from "react-spinners";
import KrsKhsStatusCard from "@/app/components/card/StatusKrsKhsCard";
import StudentPerFacultyChart from "@/app/components/card/StudentPerFacultyChart";
import PaymentCard from "@/app/components/card/PaymentCard";
import TimelineAkademik from "@/app/components/card/TimelineAkademik";
import AktivitasKRS from "@/app/components/card/AktivitasKRS";

interface Dashboard {
  totalStudents: number;
  totalFaculties: number;
  totalMajors: number;
  totalClasses: number;
  studyPlan: {
    approved: number;
    rejected: number;
    onprocess: number;
  };
  studentPerFaculty: [
    {
      facultyId: string;
      facultyName: string;
      totalStudents: number;
    }
  ];
  payment: {
    paidCount: number;
    paidSum: number;
    unpaidCount: number;
    unpaidSum: number;
  };
  studyPlans: [
    {
      courseName: string;
      studentName: string;
      lectureName: string;
      status: string;
    }
  ];
  upcomingTimeline: [
    {
      id: string;
      name: string;
      date: string;
      createdAt: string;
      updatedAt: string;
    }
  ];
}

const getDashboard = async () => {
  const res = await api.get("/stats/admin");
  return res.data.data;
};

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);

  // ambil data awal
  useEffect(() => {
    const fetchAll = async () => {
      try {
        await fetchDashboard();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const fetchDashboard = async () => {
    try {
      const data = await getDashboard();
      setDashboard(data);
    } catch (err) {
      console.error("Gagal fetch dashboard:", err);
    }
  };

  return (
    <section className="section">
      <div className="section-header">
        <h1>Dashboard</h1>
      </div>
      {loading ? (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "500px" }}
        >
          <BarLoader color="#6777ef" />
        </div>
      ) : (
        <>
          <div className="row">
            {/* Bagian kiri */}
            <div className="col-md-8">
              <AdminStatCards
                totalStudents={dashboard?.totalStudents}
                totalFaculties={dashboard?.totalFaculties}
                totalMajors={dashboard?.totalMajors}
                totalClasses={dashboard?.totalClasses}
                colWidths={[4, 3, 3, 2]}
              />

              {/* Baris khusus untuk KrsKhsStatusCard + elemen kanan */}
              <div className="row mt-4">
                <div
                  className="col-12 col-md-4 mb-t"
                  style={{ paddingRight: "5px" }}
                >
                  <KrsKhsStatusCard
                    data={{
                      disetujui: dashboard?.studyPlan.approved ?? 0,
                      diproses: dashboard?.studyPlan.onprocess ?? 0,
                      ditolak: dashboard?.studyPlan.rejected ?? 0,
                    }}
                  />
                </div>

                <div
                  className="col-12 col-md-8 mb-4"
                  style={{ paddingLeft: "10px" }}
                >
                  {/* Elemen tambahan di kanan KRS status */}
                  <div className="card p-3" style={{ borderRadius: "0.9rem" }}>
                    <StudentPerFacultyChart
                      data={dashboard?.studentPerFaculty || []}
                    ></StudentPerFacultyChart>
                  </div>
                </div>
              </div>

              {/* Baris khusus Aktivitas Kes */}
              <div
                className="row"
                style={{
                  marginTop: "-50px",
                  paddingRight: "15px",
                  paddingLeft: "15px",
                }}
              >
                <AktivitasKRS
                  studyPlans={dashboard?.studyPlans}
                  detailLink="/pages/admin/krs"
                  showScrollbar={false}
                  divHeight="500px"
                ></AktivitasKRS>
              </div>
            </div>

            {/* Bagian kanan utama */}
            <div className="col-md-4">
              <PaymentCard
                payment={
                  dashboard?.payment ?? {
                    paidCount: 0,
                    paidSum: 0,
                    unpaidCount: 0,
                    unpaidSum: 0,
                  }
                }
              />
              <div style={{ height: "575px" }}>
                <TimelineAkademik
                  upcomingTimeline={dashboard?.upcomingTimeline}
                  detailLink="admin/time-line"
                  maxHeight="550px"
                  showScrollbar={false}
                />
              </div>
            </div>
          </div>

          {/* <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h4>Bar Chart</h4>
                </div>
                <div className="card-body"></div>
              </div>
            </div>
          </div> */}
        </>
      )}
    </section>
  );
};

export default DashboardPage;
