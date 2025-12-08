'use client';

import { useEffect } from 'react';

const ScriptsLoader = () => {
  useEffect(() => {
    const scriptUrls = [
      '/assets/modules/jquery.min.js',
      '/assets/modules/popper.js',
      '/assets/modules/tooltip.js',
      '/assets/modules/bootstrap/js/bootstrap.min.js',
      '/assets/modules/nicescroll/jquery.nicescroll.min.js',
      '/assets/modules/moment.min.js',
      '/assets/js/stisla.js',
      '/assets/modules/simple-weather/jquery.simpleWeather.min.js',
      '/assets/modules/chart.min.js',
      '/assets/modules/chocolat/dist/js/jquery.chocolat.min.js',
      '/assets/modules/chart.min.js',
      '/assets/modules/datatables/datatables.min.js',
      '/assets/modules/datatables/DataTables-1.10.16/js/dataTables.bootstrap4.min.js',
      '/assets/modules/datatables/Select-1.2.4/js/dataTables.select.min.js',
      '/assets/modules/jquery-ui/jquery-ui.min.js',
      '/assets/js/page/modules-ion-icons.js',
      '/assets/js/page/modules-chartjs.js',
      '/assets/js/page/modules-datatables.js',
      '/assets/js/scripts.js',
      '/assets/js/custom.js',
    ];

    scriptUrls.forEach(src => {
      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      document.body.appendChild(script);
    });

    return () => {
      scriptUrls.forEach(src => {
        const scripts = document.querySelectorAll(`script[src="${src}"]`);
        scripts.forEach(script => script.remove());
      });
    };
  }, []);

  return null;
};

export default ScriptsLoader;
