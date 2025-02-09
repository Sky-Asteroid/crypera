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

const KlineChart = ({ data, resistanceLevels }) => {
  const chartRef = useRef(null);

  // Преобразуем данные в формат, который ожидает chart.js
  const chartData = {
    datasets: [
      {
        label: 'Candlestick Data',
        data: data.datasets[0].data.map((item) => ({
          x: new Date(item.openTime), // Преобразуем openTime в Date
          o: item.open,
          h: item.high,
          l: item.low,
          c: item.close,
        })),
        borderColor: '#333',
        color: {
          up: '#00ff00', // Зеленый цвет для растущих свечей
          down: '#ff0000', // Красный цвет для падающих свечей
          unchanged: '#999999', // Серый цвет для нейтральных свечей
        },
        barThickness: 10, // Фиксированная толщина свечей
      },
    ],
  };

  // Настройки для аннотаций (уровни сопротивления и поддержки)
  const annotations = {
    annotations: {},
  };

  // Добавляем основные уровни сопротивления
  if (resistanceLevels?.mainResistances?.length > 0) {
    resistanceLevels.mainResistances.forEach((level, index) => {
      annotations.annotations[`mainResistance${index}`] = {
        type: 'line',
        yMin: level,
        yMax: level,
        borderColor: '#FF0000', // Красный цвет для основных уровней
        borderWidth: 2,
        borderDash: [5, 5], // Пунктирная линия
        label: {
          enabled: true,
          content: `Main Resistance: ${level}`,
          position: 'end',
          backgroundColor: 'rgba(255, 0, 0, 0.5)',
        },
      };
    });
  }

  // Добавляем второстепенные уровни сопротивления
  if (resistanceLevels?.secondaryResistances?.length > 0) {
    resistanceLevels.secondaryResistances.forEach((level, index) => {
      annotations.annotations[`secondaryResistance${index}`] = {
        type: 'line',
        yMin: level,
        yMax: level,
        borderColor: '#FFA500', // Оранжевый цвет для второстепенных уровней
        borderWidth: 2,
        borderDash: [5, 5], // Пунктирная линия
        label: {
          enabled: true,
          content: `Secondary Resistance: ${level}`,
          position: 'end',
          backgroundColor: 'rgba(255, 165, 0, 0.5)',
        },
      };
    });
  }

  // Добавляем точки сброса (reset points)
  if (resistanceLevels?.resetPoint?.length > 0) {
    resistanceLevels.resetPoint.forEach((level, index) => {
      annotations.annotations[`resetPoint${index}`] = {
        type: 'line',
        yMin: level,
        yMax: level,
        borderColor: '#00FF00', // Зеленый цвет для точек сброса
        borderWidth: 2,
        borderDash: [5, 5], // Пунктирная линия
        label: {
          enabled: true,
          content: `Reset Point: ${level}`,
          position: 'end',
          backgroundColor: 'rgba(0, 255, 0, 0.5)',
        },
      };
    });
  }

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
            x: { min: 1000 * 60 * 1 }, // Минимальный интервал по времени — 1 минута
            y: { min: 10 }, // Минимальное значение для оси Y
          },
        },
      },
      annotation: annotations, // Добавляем аннотации в настройки
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute', // Подсчет времени по минутам
          stepSize: 1, // Шаг 1 минута
        },
        grid: {
          display: false,
        },
        ticks: {
          color: '#ffffff',
        },
        offset: true,
        // Устанавливаем минимальное и максимальное значение оси X
        min: new Date(data.datasets[0].data[data.datasets[0].data.length - 25].openTime).getTime(), // Начинаем с 25-й свечи с конца
        max: new Date(data.datasets[0].data[data.datasets[0].data.length - 1].openTime).getTime() + (1000 * 60 * 5), // Смещение времени вправо на 5 минут
        categoryPercentage: 1, // Свечи заполняют всю категорию (по оси X)
        barPercentage: 1, // Используем 100% ширины категории для свечей
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

  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current;
      chart.update();
    }
  }, [data, resistanceLevels]);

  return (
    <div className="chart-container">
      <Chart ref={chartRef} type="candlestick" data={chartData} options={options} />
    </div>
  );
};

export default KlineChart;