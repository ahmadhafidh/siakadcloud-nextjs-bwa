"use client";
import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

interface FacultyData {
  facultyId: string;
  facultyName: string;
  totalStudents: number;
}

interface StudentPerFacultyChartProps {
  data: FacultyData[];
  height?: number;
}

const StudentPerFacultyChart: React.FC<StudentPerFacultyChartProps> = ({
  data,
  height = 350,
}) => {
  const categories = data.map((item) => item.facultyName);
  const seriesData = data.map((item) => item.totalStudents);

  const options: Highcharts.Options = {
    chart: {
      type: "column",
    },
    title: {
      text: "Total Jumlah Mahasiswa",
    },
    xAxis: {
      categories: categories,
      labels: {
        formatter: function () {
          // ambil huruf pertama dari tiap kata
          return (this.value as string)
            .split(" ")
            .filter((word) => word.toLowerCase() !== "dan")
            .map((word) => word.charAt(0))
            .join("")
            .toUpperCase();
        },
      },
      crosshair: true,
      accessibility: {
        description: "Fakultas",
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "Jumlah Mahasiswa",
      },
    },
    tooltip: {
      valueSuffix: "mahasiswa",
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: [
      {
        name: "Mahasiswa",
        type: "column",
        data: seriesData,
        colorByPoint: true, // otomatis beda warna tiap kolom
      },
    ],
    credits: {
      enabled: false, // hilangkan watermark Highcharts
    },
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      containerProps={{ style: { height: `${height}px` } }}
    />
  );
};

export default StudentPerFacultyChart;
