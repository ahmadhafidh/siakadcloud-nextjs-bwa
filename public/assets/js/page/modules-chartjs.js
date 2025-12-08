"use strict";

document.addEventListener("DOMContentLoaded", function () {
  // Chart 1 - Line
  var ctx1 = document.getElementById("myChart");
  if (ctx1) {
    new Chart(ctx1.getContext('2d'), {
      type: 'line',
      data: {
        labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        datasets: [{
          label: 'Statistics',
          data: [460, 458, 330, 502, 430, 610, 488],
          backgroundColor: '#6777ef',
          borderColor: '#6777ef',
          borderWidth: 2.5,
          pointBackgroundColor: '#ffffff',
          pointRadius: 4
        }]
      },
      options: {
        legend: { display: false },
        scales: {
          yAxes: [{
            gridLines: { drawBorder: false, color: '#f2f2f2' },
            ticks: { beginAtZero: true, stepSize: 150 }
          }],
          xAxes: [{
            ticks: { display: false },
            gridLines: { display: false }
          }]
        }
      }
    });
  }

  // Chart 2 - Bar (fakultas)
  var ctx2 = document.getElementById("myBarChart");
  if (ctx2) {
    new Chart(ctx2.getContext("2d"), {
      type: 'bar',
      data: {
        labels: ["Fakultas Teknik", "Fakultas Kedokteran", "Fakultas Saintek"],
        datasets: [
          {
            label: 'Teknik Informatika',
            data: [120, 0, 0],
            backgroundColor: '#6777ef'
          },
          {
            label: 'Teknik Sipil',
            data: [100, 0, 0],
            backgroundColor: '#ffa426'
          },
          {
            label: 'Teknik Industri',
            data: [80, 0, 0],
            backgroundColor: '#63ed7a'
          },
          {
            label: 'Pendidikan Dokter',
            data: [0, 130, 0],
            backgroundColor: '#fc544b'
          },
          {
            label: 'Kedokteran Gigi',
            data: [0, 100, 0],
            backgroundColor: '#47c363'
          },
          {
            label: 'Farmasi',
            data: [0, 90, 0],
            backgroundColor: '#a55eea'
          },
          {
            label: 'Matematika',
            data: [0, 0, 110],
            backgroundColor: '#3abaf4'
          },
          {
            label: 'Biologi',
            data: [0, 0, 95],
            backgroundColor: '#f9ed69'
          },
          {
            label: 'Kimia',
            data: [0, 0, 100],
            backgroundColor: '#e056fd'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            stacked: false,
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            stacked: false,
            ticks: {
              beginAtZero: true
            }
          }]
        },
        tooltips: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function (tooltipItem, data) {
              var value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
              var label = data.datasets[tooltipItem.datasetIndex].label || '';
              return value !== 0 ? label + ': ' + value : null;
            }
          }
        },
        legend: {
          position: 'bottom'
        }
      }      
    });
  }
  


  // Chart 3 - Bar
  var ctx3 = document.getElementById("myChart2");
  if (ctx3) {
    new Chart(ctx3.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        datasets: [{
          label: 'Statistics',
          data: [460, 458, 330, 502, 430, 610, 488],
          backgroundColor: '#6777ef',
          borderColor: '#6777ef',
          borderWidth: 2.5,
          pointBackgroundColor: '#ffffff',
          pointRadius: 4
        }]
      },
      options: {
        legend: { display: false },
        scales: {
          yAxes: [{
            gridLines: { drawBorder: false, color: '#f2f2f2' },
            ticks: { beginAtZero: true, stepSize: 150 }
          }],
          xAxes: [{
            ticks: { display: false },
            gridLines: { display: false }
          }]
        }
      }
    });
  }

  // Chart 4 - Doughnut
  var ctx4 = document.getElementById("myChart3");
  if (ctx4) {
    new Chart(ctx4.getContext('2d'), {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [80, 50, 40, 30, 20],
          backgroundColor: ['#191d21', '#63ed7a', '#ffa426', '#fc544b', '#6777ef']
        }],
        labels: ['Black', 'Green', 'Yellow', 'Red', 'Blue']
      },
      options: {
        responsive: true,
        legend: { position: 'bottom' }
      }
    });
  }

  // Chart 5 - Pie
  var ctx5 = document.getElementById("myChart4");
  if (ctx5) {
    new Chart(ctx5.getContext('2d'), {
      type: 'pie',
      data: {
        datasets: [{
          data: [80, 50, 40, 30, 100],
          backgroundColor: ['#191d21', '#63ed7a', '#ffa426', '#fc544b', '#6777ef']
        }],
        labels: ['Black', 'Green', 'Yellow', 'Red', 'Blue']
      },
      options: {
        responsive: true,
        legend: { position: 'bottom' }
      }
    });
  }
});
