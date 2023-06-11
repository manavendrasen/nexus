import React from "react";

interface ScatterPlotProps {}

export const ScatterPlot: React.FC<ScatterPlotProps> = ({}) => {
  return <div>1</div>;
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
//     scales: {
//       x: {
//         display: false,
//         type: 'linear',
//         position: 'bottom'
//       },
//       y: {
//         display: false,
//         type: 'linear',

//       }
//     }
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
