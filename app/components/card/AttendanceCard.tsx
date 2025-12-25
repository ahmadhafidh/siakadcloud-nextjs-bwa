"use client";
import React, { useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

interface AttendanceData {
  jumlahHadir: number;
  jumlahIzin: number;
  jumlahSakit: number;
  jumlahAlfa: number;
}

interface AttendanceCardProps {
  data: AttendanceData;
}

const AttendanceCard: React.FC<AttendanceCardProps> = ({ data }) => {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  const total =
    data.jumlahHadir + data.jumlahIzin + data.jumlahSakit + data.jumlahAlfa;
  const hadirPersen = Math.round((data.jumlahHadir / total) * 100);

  interface PieSeriesWithCenter extends Highcharts.Series {
    center: [number, number, number, number];
  }

  const options: Highcharts.Options = {
    chart: {
      type: "pie",
      // @ts-expect-error - Highcharts custom property
      custom: {},
      events: {
        render(this: Highcharts.Chart) {
          const series = this.series[0] as PieSeriesWithCenter;

          // @ts-expect-error - Highcharts custom property
          let customLabel = this.options.chart?.custom?.label;

          if (!customLabel) {
            // @ts-expect-error - Highcharts custom property
            customLabel = this.options.chart!.custom!.label = this.renderer
              .label(`Hadir<br/><strong>${hadirPersen}%</strong>`, 0, 0)
              .css({
                color: "var(--highcharts-neutral-color-100, #000)",
                textAnchor: "middle",
              })
              .add();
          }

          const x = series.center[0] + this.plotLeft;
          const y =
            series.center[1] + this.plotTop - customLabel.attr("height") / 2;

          customLabel.attr({ x, y });
          customLabel.css({
            fontSize: `${series.center[2] / 12}px`,
          });
        },
      },
    },
    title: {
      text: "Rekap Kehadiran",
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.y}</b>",
    },
    plotOptions: {
      pie: {
        innerSize: "70%",
        dataLabels: [
          {
            enabled: true,
            distance: 20,
            format: "{point.name}",
          },
          {
            enabled: true,
            distance: -15,
            format: "{point.percentage:.0f}%",
            style: {
              fontSize: "0.9em",
            },
          },
        ],
      },
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        type: "pie",
        name: "Jumlah",
        colorByPoint: true,
        data: [
          { name: "Hadir", y: data.jumlahHadir, color: "#f68e17ff" },
          { name: "Izin", y: data.jumlahIzin, color: "#FFE7CC" },
          { name: "Sakit", y: data.jumlahSakit, color: "#FEC78A" },
          { name: "Alfa", y: data.jumlahAlfa, color: "#FDB366" },
        ],
      } as Highcharts.SeriesPieOptions,
    ],
  };

  return (
    <div
      className="bg-white rounded-xl shadow-md p-4 mb-4 shadow-sm"
      style={{ borderRadius: "0.9rem", width: "374px", height: "500px" }}
    >
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartComponentRef}
      />
      {/* Indikator hadir, izin, sakit, alfa */}
      <div className="d-flex justify-content-around mt-2">
        <div className="d-flex flex-column align-items-center">
          <span
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#f68e17ff",
            }}
          ></span>
          <small>Hadir</small>
          <strong>{data.jumlahHadir}</strong>
        </div>
        <div className="d-flex flex-column align-items-center">
          <span
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#FFE7CC",
            }}
          ></span>
          <small>Izin</small>
          <strong>{data.jumlahIzin}</strong>
        </div>
        <div className="d-flex flex-column align-items-center">
          <span
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#FEC78A",
            }}
          ></span>
          <small>Sakit</small>
          <strong>{data.jumlahSakit}</strong>
        </div>
        <div className="d-flex flex-column align-items-center">
          <span
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#FDB366",
            }}
          ></span>
          <small>Alfa</small>
          <strong>{data.jumlahAlfa}</strong>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCard;
