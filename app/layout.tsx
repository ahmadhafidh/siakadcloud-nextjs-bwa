// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
      {/* General CSS */}
        <link rel="stylesheet" href="/assets/modules/bootstrap/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/modules/fontawesome/css/all.min.css" />
      {/* CSS Libraries */}
        <link rel="stylesheet" href="/assets/modules/datatables/datatables.min.css" />
        <link rel="stylesheet" href="/assets/modules/datatables/DataTables-1.10.16/css/dataTables.bootstrap4.min.css" />
        <link rel="stylesheet" href="/assets/modules/datatables/Select-1.2.4/css/select.bootstrap4.min.css" />
        <link rel="stylesheet" href="/assets/modules/ionicons/css/ionicons.min.css" />
        <link rel="stylesheet" href="/assets/modules/fullcalendar/fullcalendar.min.css" />
        <link rel="stylesheet" href="/assets/modules/prism/prism.css" />
      {/* Template CSS */}
        <link rel="stylesheet" href="/assets/css/style.css" />
        <link rel="stylesheet" href="/assets/css/components.css" />
      </head>
      <body>
        {children}
        
      {/* Script JS Stisla */}
        <script src="/assets/modules/jquery.min.js"></script>
        <script src="/assets/modules/popper.js"></script>
        <script src="/assets/modules/tooltip.js"></script>
        <script src="/assets/modules/bootstrap/js/bootstrap.min.js"></script>
        <script src="/assets/modules/nicescroll/jquery.nicescroll.min.js"></script>
        <script src="/assets/modules/moment.min.js"></script>
        <script src="/assets/js/stisla.js"></script>

      {/* Script JS Stisla */}
        <script src="/assets/modules/simple-weather/jquery.simpleWeather.min.js"></script>
        <script src="/assets/modules/chart.min.js"></script>
        <script src="/assets/modules/chocolat/dist/js/jquery.chocolat.min.js"></script>
        <script src="/assets/modules/chart.min.js"></script>
        <script src="/assets/modules/datatables/datatables.min.js"></script>
        <script src="/assets/modules/datatables/DataTables-1.10.16/js/dataTables.bootstrap4.min.js"></script>
        <script src="/assets/modules/datatables/Select-1.2.4/js/dataTables.select.min.js"></script>
        <script src="/assets/modules/jquery-ui/jquery-ui.min.js"></script>
        <script src="/assets/modules/fullcalendar/fullcalendar.min.js"></script>
        <script src="/assets/modules/prism/prism.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>

        <script src="/assets/js/page/modules-ion-icons.js"></script>
        <script src="/assets/js/page/modules-chartjs.js"></script>
        <script src="/assets/js/page/modules-datatables.js"></script>
        <script src="/assets/js/page/bootstrap-modal.js"></script>
        <script src="/assets/js/page/modules-calendar.js"></script>

        <script src="/assets/js/scripts.js"></script>
        <script src="/assets/js/custom.js"></script>
        
      </body>
    </html>
  );
}
