"use client";
import React, { useEffect, useState } from "react";
import api from "@/app/lib/axiosInstance";
import Cookies from "js-cookie";
import { BarLoader } from "react-spinners";

// Import komponen yang sudah dipecah
import StatistikCards from "@/app/components/card/StatistikCards";
import KelasMengajar from "@/app/components/card/KelasMengajar";
import TimelineAkademik from "@/app/components/card/TimelineAkademik";
import AktivitasKRS from "@/app/components/card/AktivitasKRS";

interface Profile {
  id: string;
  name: string;
  emai: string;
  totalStudents: number;
  totalClasses: number;
  totalSks: number;
  schedules?: Schedule[];
  upcomingTimeline: Timeline[];
  studyPlans: StudyPlans[];
}

interface StudyPlans {
  courseName: string;
  studentName: string;
  status: string;
}

interface Timeline {
  id: string;
  name: string;
  date: string;
}

interface Schedule {
  id: string;
  day: string;
  timeStart: string;
  timeEnd: string;
  class: Class;
  course: Course;
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

const getDashboard = async () => {
  const res = await api.get("/manage-lectures/stats");
  return res.data.data;
};

const DosenDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Partial<Profile>>({});

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
    if (profile.name) {
      Cookies.set("lectureName", profile?.name, { expires: 1 });
    }
  }, [profile]);

  const fetchDashboard = async () => {
    try {
      const data = await getDashboard();
      setProfile(data);
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
            {/* KIRI - konten utama */}
            <div className="col-md-8">
              {/* Statistik cards */}
              <StatistikCards
                totalStudents={profile.totalStudents}
                totalClasses={profile.totalClasses}
                totalSks={profile.totalSks}
              />

              {/* Kelas Mengajar */}
              <KelasMengajar
                schedules={profile.schedules}
                detailLink="/pages/dosen/jadwal"
                showAllData={true}
                showScrollbar={false}
              />
            </div>

            {/* KANAN - Timeline Akademik */}
            <div className="col-md-4">
              <TimelineAkademik
                upcomingTimeline={profile.upcomingTimeline}
                detailLink="#"
                maxHeight="325px"
                showScrollbar={false}
              />
            </div>

            {/* BAWAH - Aktivitas KRS*/}
            <div className="col-12">
              <AktivitasKRS
                studyPlans={profile.studyPlans}
                detailLink="/pages/dosen/krs"
                showScrollbar={false}
              />
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default DosenDashboard;
