// app/layout.tsx
import Script from "next/script";
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
        <Script src="/assets/modules/jquery.min.js"></Script>
        <Script src="/assets/modules/popper.js"></Script>
        <Script src="/assets/modules/tooltip.js"></Script>
        <Script src="/assets/modules/bootstrap/js/bootstrap.min.js"></Script>
        <Script src="/assets/modules/nicescroll/jquery.nicescroll.min.js"></Script>
        <Script src="/assets/modules/moment.min.js"></Script>
        <Script src="/assets/js/stisla.js"></Script>

      {/* Script JS Stisla */}
        <Script src="/assets/modules/simple-weather/jquery.simpleWeather.min.js"></Script>
        <Script src="/assets/modules/chart.min.js"></Script>
        <Script src="/assets/modules/chocolat/dist/js/jquery.chocolat.min.js"></Script>
        <Script src="/assets/modules/chart.min.js"></Script>
        <Script src="/assets/modules/datatables/datatables.min.js"></Script>
        <Script src="/assets/modules/datatables/DataTables-1.10.16/js/dataTables.bootstrap4.min.js"></Script>
        <Script src="/assets/modules/datatables/Select-1.2.4/js/dataTables.select.min.js"></Script>
        <Script src="/assets/modules/jquery-ui/jquery-ui.min.js"></Script>
        <Script src="/assets/modules/fullcalendar/fullcalendar.min.js"></Script>
        <Script src="/assets/modules/prism/prism.js"></Script>
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></Script>

        <Script src="/assets/js/page/modules-ion-icons.js"></Script>
        <Script src="/assets/js/page/modules-chartjs.js"></Script>
        <Script src="/assets/js/page/modules-datatables.js"></Script>
        <Script src="/assets/js/page/bootstrap-modal.js"></Script>
        <Script src="/assets/js/page/modules-calendar.js"></Script>

        <Script src="/assets/js/Scripts.js"></Script>
        <Script src="/assets/js/custom.js"></Script>
        
      </body>
    </html>
  );
}
