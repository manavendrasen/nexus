import Response from "@/constants/Response";
import {
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import React from "react";
import { Scatter } from "react-chartjs-2";

interface ScatterPlotProps {
  data: Response[];
  userEmail?: string;
}

export const ScatterPlot: React.FC<ScatterPlotProps> = ({
  data,
  userEmail,
}) => {
  ChartJS.register(
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    zoomPlugin
  );

  const zoomOptions = {
    pan: {
      enabled: true,
      mode: "xy" as "xy",
    },
    zoom: {
      wheel: {
        enabled: true,
      },
      pinch: {
        enabled: true,
      },
      mode: "xy" as "xy",
      // onZoomComplete({chart}) {
      //   // This update is needed to display up to date zoom level in the title.
      //   // Without this, previous zoom level is displayed.
      //   // The reason is: title uses the same beforeUpdate hook, and is evaluated before zoom.
      //   chart.update('none');
      // }
    },
  };

  const dataForChart = data.map(response => {
    return {
      x: response.coordinates?.at(0),
      y: response.coordinates?.at(1),
      data: {
        name: response.textResponses[0],
        textResponses: response.textResponses,
        optionResponses: response.optionResponses,
        userEmail: response.userEmail,
      },
    };
  });

  const chartData = {
    datasets: [
      {
        label: "Scatter Dataset",
        data: dataForChart,
        backgroundColor: "#8839ef",
        pointRadius: 10,
        tooltip: {
          callbacks: {
            title: function (context: any) {
              return context.raw.data.name;
            },
            label: function (context: any) {
              return context.raw.data.textResponses.map((response: string) => {
                return response;
              });
            },
          },
        },
        pointBackgroundColor: function (context: any) {
          if (userEmail) {
            const pointUserEmail = context?.raw?.data?.userEmail;
            if (pointUserEmail === userEmail) {
              return "#40a02b";
            } else {
              return "#8839ef";
            }
          }
          return "#8839ef";
        },
      },
    ],
  };

  const config = {
    type: "scatter",
    data: data,

    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          border: {
            display: false,
          },
          grid: {
            color: "#6c708650",
            display: true,
          },
          ticks: {
            display: false,
          },
        },
        y: {
          border: {
            display: false,
          },
          grid: {
            color: "#6c708650",
            display: true,
          },
          ticks: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },

        zoom: zoomOptions,
        title: {
          display: false,
          // text: ctx =>
          //   "Zoom: " + zoomStatus(ctx.chart) + ", Pan: " + panStatus(),
        },
      },
      // onClick(e) {
      //   console.log(e.type);
      // },
    },
  };

  return <Scatter options={config.options} data={chartData} />;
};

// https://stackoverflow.com/questions/28159595/chartjs-different-color-per-data-point
// const config = {
//   type: 'scatter',
//   data: data,
//   options: {
//     plugins: {
//       tooltip:{
//         callbacks: {
//           label: function(context) {
//             return context.raw.data.name;
//           }
//         }
//       },
//       legend: {
//         display: false,
//       },
//     },
// scales: {
//   x: {
//     display: false,
//     type: 'linear',
//     position: 'bottom'
//   },
//   y: {
//     display: false,
//     type: 'linear',

//   }
// }
//   }
// };
// const data = {
//   datasets: [{
//     label: 'Scatter Dataset',
//     data: [{
//       x: -10,
//       y: 0,
//       data: {
//         "name": "1"
//       }
//     }, {
//       x: 0,
//       y: 10,
//       data: {
//         "name": "2"
//       }
//     }, {
//       x: 10,
//       y: 5,
//       data: {
//         "name": "3"
//       }
//     }, {
//       x: 0.5,
//       y: 5.5,
//       data: {
//         "name": "4"
//       }
//     }],
//     backgroundColor: 'rgb(255, 99, 132)'
//   }],
// };

// -------------------------------

// const config = {
//   type: 'scatter',
//   data: data,

//   options: {
//   scales: {
//         x: {
//         border: {
//           display: false
//         },
//         grid: {
//           display: true
//           },
//         ticks: {
//         display:false,
//         },
//       },
//       y: {
//         border: {
//           display: false
//         },
//         grid: {
//           display: true
//           },
//         ticks: {
//         display:false,
//         },
//       }
//       },
//     plugins: {
//       legend: {
//         display: false,
//       },

//       zoom: zoomOptions,
//       title: {
//         display: true,
//         position: 'bottom',
//         text: (ctx) => 'Zoom: ' + zoomStatus(ctx.chart) + ', Pan: ' + panStatus()
//       }
//     },
//     onClick(e) {
//       console.log(e.type);
//     }
//   }
// };
