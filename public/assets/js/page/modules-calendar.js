"use strict";

$("#myEvent").fullCalendar({
  height: 'auto',
  header: {
    left: 'prev,next today',
    center: 'title',
    right: 'month,agendaWeek,agendaDay,listWeek'
  },
  editable: true,
  events: [
    {
      title: 'Pemrograman Web - Kelas A',
      start: '2025-04-08T08:00:00',
      end: '2025-04-08T10:00:00',
      backgroundColor: "#6777ef",
      borderColor: "#6777ef",
      textColor: '#fff'
    },
    {
      title: 'Pemrograman Web - Kelas A',
      start: '2025-04-15T08:00:00',
      end: '2025-04-15T10:00:00',
      backgroundColor: "#6777ef",
      borderColor: "#6777ef",
      textColor: '#fff'
    },
    {
      title: 'Pemrograman Web - Kelas A',
      start: '2025-04-22T08:00:00',
      end: '2025-04-22T10:00:00',
      backgroundColor: "#6777ef",
      borderColor: "#6777ef",
      textColor: '#fff'
    },
    {
      title: 'Pemrograman Web - Kelas A',
      start: '2025-04-29T08:00:00',
      end: '2025-04-29T10:00:00',
      backgroundColor: "#6777ef",
      borderColor: "#6777ef",
      textColor: '#fff'
    }
  ]
});
