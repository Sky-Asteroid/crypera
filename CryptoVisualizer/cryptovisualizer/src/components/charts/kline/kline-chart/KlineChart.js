import React, { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  TimeScale,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
import zoomPlugin from 'chartjs-plugin-zoom';
import annotationPlugin from 'chartjs-plugin-annotation';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  CandlestickController,
  CandlestickElement,
  zoomPlugin,
  annotationPlugin
);

const KlineChart = ({ data, resistanceLevels, intervalPad }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    console.log("intervalPad: " + intervalPad)
    if (data && data.datasets && data.datasets[0] && data.datasets[0].data.length > 0) {
      if (chartRef.current) {
        const chart = chartRef.current;
        chart.update();
      }
    }
  }, [data, resistanceLevels]);

  if (!data || !data.datasets || !data.datasets[0] || !data.datasets[0].data || data.datasets[0].data.length === 0) {
    return <div>No data available</div>;
  }

  const chartData = {
    datasets: [
      {
        label: 'Candlestick Data',
        data: data.datasets[0].data.map((item) => ({
          x: new Date(item.openTime),
          o: item.open,
          h: item.high,
          l: item.low,
          c: item.close,
        })),
        borderColor: '#333',
        color: {
          up: '#00ff00',
          down: '#ff0000',
          unchanged: '#999999',
        },
        barThickness: 10,
      },
    ],
  };

  const annotations = {
    annotations: {},
  };

  if (resistanceLevels?.maxHighResult?.mainResistances?.length > 0) {
    resistanceLevels.maxHighResult.mainResistances.forEach((level, index) => {
      annotations.annotations[`high-max-${index}`] = {
        type: 'line',
        yMin: level,
        yMax: level,
        borderColor: '#FF0000',
        borderWidth: 2,
        borderDash: [5, 5],
        label: {
          enabled: true,
          content: `High Max: ${level}`,
          position: 'end',
          backgroundColor: 'rgba(255, 0, 0, 0.5)',
        },
      };
    });
  }

  if (resistanceLevels?.frequentHighResult?.mainResistances?.length > 0) {
    resistanceLevels.frequentHighResult.mainResistances.forEach((level, index) => {
      annotations.annotations[`frequent-high-${index}`] = {
        type: 'line',
        yMin: level,
        yMax: level,
        borderColor: '#0000FF',
        borderWidth: 2,
        borderDash: [5, 5],
        label: {
          enabled: true,
          content: `Frequent High: ${level}`,
          position: 'end',
          backgroundColor: 'rgba(0, 0, 255, 0.5)',
        },
      };
    });
  }

  if (resistanceLevels?.fibonacciLevelsResult?.mainResistances?.length > 0) {
    const fibLevels = resistanceLevels.fibonacciLevelsResult.mainResistances;

    const fibColors = ['rgba(0, 255, 0, 0.2)', 'rgba(0, 0, 255, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 165, 0, 0.2)',];

    for (let i = 0; i < fibLevels.length - 1; i++) {
      annotations.annotations[`fibonacci-box-${i}`] = {
        type: 'box',
        yMin: fibLevels[i + 1],
        yMax: fibLevels[i],
        backgroundColor: fibColors[i % fibColors.length],
        borderWidth: 0,
      };
    }
  }

  if (resistanceLevels?.volumeClustersResult?.mainResistances?.length > 0) {
    resistanceLevels.volumeClustersResult.mainResistances.forEach((level, index) => {
      annotations.annotations[`volume-clusters-${index}`] = {
        type: 'line',
        yMin: level,
        yMax: level,
        borderColor: '#00FF00',
        borderWidth: 2,
        borderDash: [5, 5],
        label: {
          enabled: true,
          content: `Volume Clusters: ${level}`,
          position: 'end',
          backgroundColor: 'rgba(0, 255, 0, 0.5)',
        },
      };
    });
  }

  const intervalOffset = {
    "1m": 1000 * 60 * 5,
    "5m": 1000 * 60 * 25,
    "15m": 1000 * 60 * 75,
    "1h": 1000 * 60 * 60 * 5,
    "4h": 1000 * 60 * 60 * 20,
    "1d": 1000 * 60 * 60 * 24 * 5,
  };

  // Установите значения min и max динамически
  const xAxisMin = new Date(
    data.datasets[0].data[Math.max(data.datasets[0].data.length - 25, 0)].openTime
  ).getTime();
  const xAxisMax =
    new Date(data.datasets[0].data[data.datasets[0].data.length - 1].openTime).getTime() +
    (intervalOffset[intervalPad] || intervalOffset["1m"]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const { o, h, l, c } = context.raw;
            return `Open: ${o}, High: ${h}, Low: ${l}, Close: ${c}`;
          },
        },
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
        },
        zoom: {
          pinch: {
            enabled: true,
          },
          wheel: {
            enabled: true,
            speed: 0.1,
          },
          mode: 'x',
          limits: {
            x: { min: 1000 * 60 * 1 },
            y: { min: 10 },
          },
        },
      },
      annotation: annotations,
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
          stepSize: 1,
        },
        grid: {
          display: false,
        },
        ticks: {
          color: '#ffffff',
        },
        offset: true,
        min: xAxisMin,
        max: xAxisMax,
        categoryPercentage: 1,
        barPercentage: 1,
      },
      y: {
        grid: {
          color: '#444',
        },
        ticks: {
          color: '#ffffff',
          min: Math.min(...data.datasets[0].data.map((item) => item.low)) - 5,
          max: Math.max(...data.datasets[0].data.map((item) => item.high)) + 5,
        }, 
      },
    },
  };

  return (
    <div className="chart-container">
      <Chart ref={chartRef} type="candlestick" data={chartData} options={options} />
    </div>
  );
};

export default KlineChart;