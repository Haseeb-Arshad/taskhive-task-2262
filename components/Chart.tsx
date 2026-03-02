import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line, Pie, Doughnut, Radar, PolarArea } from 'react-chartjs-2';
import { useTheme } from '@/hooks/useTheme';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface ChartProps {
  type: 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'polar';
  data: ChartDataPoint[];
  title?: string;
  height?: number;
  width?: number;
  options?: Chart.ChartOptions;
  loading?: boolean;
  error?: string;
}

export const Chart: React.FC<ChartProps> = ({ 
  type, 
  data, 
  title = 'Advanced Magic Calculator',
  height = 400, 
  width = 600, 
  options = {},
  loading = false,
  error
}) => {
  const { theme } = useTheme();
  const [chartData, setChartData] = useState<Chart.ChartData>({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    if (loading) {
      setChartData({
        labels: ['Loading...'],
        datasets: [{
          label: 'Loading',
          data: [0],
          backgroundColor: ['rgba(0, 0, 0, 0.1)'],
          borderColor: ['rgba(0, 0, 0, 0.2)']
        }]
      });
    } else if (error) {
      setChartData({
        labels: ['Error'],
        datasets: [{
          label: 'Error',
          data: [0],
          backgroundColor: ['rgba(255, 0, 0, 0.2)'],
          borderColor: ['rgba(255, 0, 0, 0.5)']
        }]
      });
    } else {
      const labels = data.map(item => item.label);
      const values = data.map(item => item.value);
      const backgroundColors = data.map(item => item.color || generateColor());
      const borderColors = data.map(item => adjustColor(item.color || generateColor(), 0.2));

      setChartData({
        labels,
        datasets: [{
          label: title,
          data: values,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1
        }]
      });
    }
  }, [data, loading, error, title]);

  const generateColor = (): string => {
    const colors = [
      'rgba(255, 99, 132, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(255, 206, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(199, 199, 199, 0.2)'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const adjustColor = (color: string, amount: number): string => {
    const rgba = color.match(/\d+,\s*\d+,\s*\d+/);
    if (rgba) {
      const [r, g, b] = rgba[0].split(',').map(Number);
      return `rgba(${r}, ${g}, ${b}, ${amount})`;
    }
    return color;
  };

  const defaultOptions: Chart.ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value.toLocaleString();
          }
        }
      },
      x: {
        ticks: {
          callback: function(value) {
            return value.toString();
          }
        }
      }
    }
  };

  const mergedOptions = { ...defaultOptions, ...options };

  if (loading) {
    return (
      <div className="chart-container loading">
        <div className="chart-placeholder">
          <div className="spinner"></div>
          <p>Loading chart data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-container error">
        <div className="chart-placeholder">
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      {type === 'bar' && (
        <Bar
          data={chartData}
          options={mergedOptions}
          height={height}
          width={width}
          className="chart-canvas"
        />
      )}
      {type === 'line' && (
        <Line
          data={chartData}
          options={mergedOptions}
          height={height}
          width={width}
          className="chart-canvas"
        />
      )}
      {type === 'pie' && (
        <Pie
          data={chartData}
          options={mergedOptions}
          height={height}
          width={width}
          className="chart-canvas"
        />
      )}
      {type === 'doughnut' && (
        <Doughnut
          data={chartData}
          options={mergedOptions}
          height={height}
          width={width}
          className="chart-canvas"
        />
      )}
      {type === 'radar' && (
        <Radar
          data={chartData}
          options={mergedOptions}
          height={height}
          width={width}
          className="chart-canvas"
        />
      )}
      {type === 'polar' && (
        <PolarArea
          data={chartData}
          options={mergedOptions}
          height={height}
          width={width}
          className="chart-canvas"
        />
      )}
    </div>
  );
};

// Example usage:
// const data = [
//   { label: 'Math', value: 85, color: 'rgba(255, 99, 132, 0.2)' },
//   { label: 'Physics', value: 78, color: 'rgba(54, 162, 235, 0.2)' },
//   { label: 'Chemistry', value: 92, color: 'rgba(255, 206, 86, 0.2)' },
//   { label: 'Biology', value: 88, color: 'rgba(75, 192, 192, 0.2)' }
// ];
// 
// <Chart type="bar" data={data} title="Subject Scores" />