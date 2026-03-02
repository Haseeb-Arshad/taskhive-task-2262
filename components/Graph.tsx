import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import { useTheme } from '@/hooks/useTheme';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

interface GraphProps {
  type: 'bar' | 'line' | 'pie' | 'doughnut';
  data: Chart.ChartData;
  options?: Chart.ChartOptions;
  height?: number;
  width?: number;
}

export const Graph: React.FC<GraphProps> = ({ type, data, options = {}, height = 400, width = 600 }) => {
  const { theme } = useTheme();
  
  const defaultOptions: Chart.ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Advanced Magic Calculator',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return (
    <div className="graph-container">
      {type === 'bar' && (
        <Bar
          data={data}
          options={mergedOptions}
          height={height}
          width={width}
          className="graph-canvas"
        />
      )}
      {type === 'line' && (
        <Line
          data={data}
          options={mergedOptions}
          height={height}
          width={width}
          className="graph-canvas"
        />
      )}
      {type === 'pie' && (
        <Pie
          data={data}
          options={mergedOptions}
          height={height}
          width={width}
          className="graph-canvas"
        />
      )}
      {type === 'doughnut' && (
        <Doughnut
          data={data}
          options={mergedOptions}
          height={height}
          width={width}
          className="graph-canvas"
        />
      )}
    </div>
  );
};

// Example usage:
// const data = {
//   labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//   datasets: [{
//     label: '# of Votes',
//     data: [12, 19, 3, 5, 2, 3],
//     backgroundColor: [
//       'rgba(255, 99, 132, 0.2)',
//       'rgba(54, 162, 235, 0.2)',
//       'rgba(255, 206, 86, 0.2)',
//       'rgba(75, 192, 192, 0.2)',
//       'rgba(153, 102, 255, 0.2)',
//       'rgba(255, 159, 64, 0.2)'
//     ],
//     borderColor: [
//       'rgba(255, 99, 132, 1)',
//       'rgba(54, 162, 235, 1)',
//       'rgba(255, 206, 86, 1)',
//       'rgba(75, 192, 192, 1)',
//       'rgba(153, 102, 255, 1)',
//       'rgba(255, 159, 64, 1)'
//     ],
//     borderWidth: 1,
//   }]
// };
// 
// <Graph type="bar" data={data} />