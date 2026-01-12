"use client";
import React, { useState, useEffect } from "react";
import api from "@/app/lib/axiosInstance";
import ScheduleCalendar from "@/app/components/ScheduleCalendar";
import { BarLoader } from "react-spinners";

interface ApiSchedule {
  id: string;
  day: string;
  timeStart: string;
  timeEnd: string;
  classId: string;
  className: string;
}

interface ApiCourse {
  id: string;
  name: string;
  schedules: ApiSchedule[];
}

interface Jadwal {
  id: string;
  day: string;
  timeStart: string;
  timeEnd: string;
  createdAt: string;
  classId: string;
  courseId: string;
  courseName: string;
  className: string;
}

const getJadwal = async (): Promise<Jadwal[]> => {
  const res = await api.get("/manage-lectures/schedules");
  const courses = res.data.data.courses;

  // console.log("=== Full response dari server ===");
  // console.log(res.data);

  // flatten schedules + inject courseName & className
  const jadwal: Jadwal[] = courses.flatMap((course: ApiCourse) =>
    course.schedules.map((schedule: ApiSchedule) => ({
      id: schedule.id,
      day: schedule.day,
      timeStart: schedule.timeStart,
      timeEnd: schedule.timeEnd,
      createdAt: "", // karena tidak ada di response
      classId: schedule.classId,
      className: schedule.className,
      courseId: course.id,
      courseName: course.name,
    }))
  );

  // console.log("=== Jadwal hasil mapping ===");
  // console.log(JSON.stringify(jadwal, null, 2));

  return jadwal;
};

const JadwalDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [jadwalList, setJadwalList] = useState<Jadwal[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await getJadwal();
        setJadwalList(data);
      } catch (err) {
        console.error("Gagal fetch jadwal:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return (
    <section className="section">
      <div className="section-header">
        <h1>Jadwal</h1>
      </div>

      <div className="section-body">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h4>Jadwal</h4>
              </div>
              <div className="card-body">
                {loading ? (
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ minHeight: "300px" }}
                  >
                    <BarLoader color="#6777ef" />
                  </div>
                ) : (
                  <ScheduleCalendar jadwal={jadwalList} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JadwalDashboard;
