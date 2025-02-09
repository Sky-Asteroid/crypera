import React, { useRef } from 'react';
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
import 'chartjs-adapter-date-fns';
import '../../../App.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  CandlestickController,
  CandlestickElement,
  zoomPlugin
);

const CandlestickChart = ({ data }) => {
  const chartRef = useRef(null);

  // Ограничиваем количество свечей до 100
  const limitedData = data.datasets[0].data.slice(-20); // Только последние 100 свечей

  const chartData = {
    datasets: [
      {
        label: 'Candlestick Data',
        data: limitedData.map((item) => ({
          x: new Date(item.x),
          o: item.o,
          h: item.h,
          l: item.l,
          c: item.c,
        })),
        borderColor: '#333',
        color: {
          up: '#00ff00',
          down: '#ff0000',
          unchanged: '#999999',
        },
        barThickness: null,  // Убираем фиксированную толщину свечей
        maxBarThickness: 20, // Ограничение на максимальную толщину
      },
    ],
  };

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
            x: { min: 1000 * 60 * 1 },  // Минимальный интервал по времени — 1 минута
            y: { min: 10 },              // Минимальное значение для оси Y
          },
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',  // Подсчет времени по минутам
          stepSize: 1,     // Шаг 1 минута
        },
        grid: {
          display: false,
        },
        ticks: {
          color: '#ffffff',
        },
        offset: true,
        // Устанавливаем минимальное время на оси X
        min: new Date(limitedData[0].x).getTime() - (1000 * 60 * 5),  // Смещение времени влево на 5 минут
        max: new Date(limitedData[limitedData.length - 1].x).getTime() + (1000 * 60 * 5),  // Смещение времени вправо на 5 минут
        // Гибкая настройка ширины свечей
        categoryPercentage: 1,  // Свечи заполняют всю категорию (по оси X)
        barPercentage: 1,       // Используем 100% ширины категории для свечей
      },
      y: {
        grid: {
          color: '#444',
        },
        ticks: {
          color: '#ffffff',
          min: Math.min(...limitedData.map((item) => item.l)) - 5,
          max: Math.max(...limitedData.map((item) => item.h)) + 5,
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

export default CandlestickChart;
