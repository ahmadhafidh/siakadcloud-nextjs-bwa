"use client";
import { Calendar, momentLocalizer, View } from "react-big-calendar";
import moment from "moment";
import "moment/locale/id";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";

moment.locale("id");
const localizer = momentLocalizer(moment);

export default function ScheduleCalendar({ jadwal }: { jadwal: any[] }) {
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());

  // Mapping jadwal ke events
  const events = jadwal.map((sch) => ({
    id: sch.id,
    title: `${sch.courseName} (${sch.className})`,
    start: moment(sch.timeStart).toDate(),
    end: moment(sch.timeEnd).toDate(),
  }));

  return (
    <div style={{ height: "80vh", width: "100%", display: "flex" }}>
      <Calendar
        localizer={localizer}
        culture="id"
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={["day", "week", "month", "agenda"]}
        style={{ flex: 1 }}
        view={view} // controlled
        date={date} // controlled
        onView={(newView) => {
          setView(newView);
        }}
        onNavigate={(newDate, newView) => {
          setDate(newDate);
          setView(newView);
        }}
        // eventPropGetter={() => {
        //   return {
        //     style: {
        //       backgroundColor:"#6777ef",
        //       color: "white",
        //       borderRadius: "3px",
        //       padding: "5px",
        //     },
        //   };
        // }}
        formats={{
          timeGutterFormat: (date: Date) => moment(date).format("HH:mm"),
          eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
            `${moment(start).format("HH:mm")} - ${moment(end).format("HH:mm")}`,
          agendaTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
            `${moment(start).format("HH:mm")} - ${moment(end).format("HH:mm")}`,
        }}
      />
    </div>
  );
}
