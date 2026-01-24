"use client";
import React, { useEffect, useState } from "react";
import api from "@/app/lib/axiosInstance";
import Cookies from "js-cookie";
import AktivitasKRS from "@/app/components/card/AktivitasKRS";
import KelasMengajar from "@/app/components/card/KelasMengajar";
import TimelineAkademik from "@/app/components/card/TimelineAkademik";
import AttendanceCard from "@/app/components/card/AttendanceCard";
import { BarLoader } from "react-spinners";

interface Dashboard {
  profile: Profile;
  schedules: Schedule[];
  studyPlans: StudyPlan[];
  absensiStudent: AbsensiStudent;
  upcomingTimeline: UpcomingTimeline[];
}

interface Profile {
  id: string;
  name: string;
  emai: string;
}

interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
}

interface Class {
  id: string;
  name: string;
}

interface Schedule {
  id: string;
  day: string;
  courseName: string;
  courseCredits: number;
  class: string;
  timeStart: string;
  timeEnd: string;
}

interface Schedules {
  id: string;
  day: string;
  timeStart: string;
  timeEnd: string;
  class: Class;
  course: Course;
}
interface StudyPlans {
  courseName: string;
  studentName: string;
  status: string;
}

interface StudyPlan {
  name: string;
  lecture: string;
  status: string;
}

interface AbsensiStudent {
  jumlahHadir: number;
  jumlahIzin: number;
  jumlahSakit: number;
  jumlahAlfa: number;
}

interface UpcomingTimeline {
  id: string;
  name: string;
  date: string;
}

const getDashboard = async () => {
  const res = await api.get("/manage-students/stats");
  return res.data.data;
};

const MahasiswaDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<Partial<Dashboard>>({});
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

  useEffect(() => {
    if (dashboard?.profile?.name) {
      Cookies.set("studentName", dashboard?.profile?.name, { expires: 1 });
    }
  }, [dashboard]);

  const fetchDashboard = async () => {
    try {
      const data = await getDashboard();
      setDashboard(data);
    } catch (err) {
      console.error("Gagal fetch dashboard:", err);
    }
  };

  const mapToStudyPlans = (plan: StudyPlan): StudyPlans => ({
    courseName: plan.name,
    studentName: plan.lecture,
    status: plan.status,
  });

  const mapToStudySchedules = (plan: Schedule): Schedules => ({
    id: plan.id,
    day: plan.day,
    timeStart: plan.timeStart,
    timeEnd: plan.timeEnd,
    class: { id: "", name: plan.class },
    course: {
      id: "",
      name: plan.courseName,
      credits: plan.courseCredits,
      code: "",
    },
  });

  const mappedPlans = dashboard.studyPlans?.map(mapToStudyPlans);
  const mappedSchedules = dashboard.schedules?.map(mapToStudySchedules);
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
            {/* KIRI */}
            <div className="col-md-8">
              <KelasMengajar
                schedules={mappedSchedules}
                detailLink="/pages/dosen/jadwal"
                showAllData={true}
                showScrollbar={false}
                title="Kelas yang diambil"
              />

              <AktivitasKRS
                studyPlans={mappedPlans}
                detailLink="/pages/mahasiswa/krs"
                showScrollbar={false}
                headerMid="Dosen Pengampu"
                divHeight="655px"
              />
            </div>

            {/* KANAN */}
            <div className="col-md-4 d-flex flex-column gap-3 mt-3">
              <AttendanceCard
                data={
                  Array.isArray(dashboard.absensiStudent)
                    ? dashboard.absensiStudent[0]
                    : dashboard.absensiStudent
                }
              />
              <TimelineAkademik
                upcomingTimeline={dashboard.upcomingTimeline}
                detailLink="#"
                maxHeight="325px"
                showScrollbar={false}
              />
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default MahasiswaDashboard;
