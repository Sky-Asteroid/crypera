import React, { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  TimeScale,
  PointElement,
  LineElement,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';
import annotationPlugin from 'chartjs-plugin-annotation';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  PointElement,
  LineElement,
  zoomPlugin,
  annotationPlugin
);

const LineChart = ({ data, resistanceLevels }) => {
  const chartRef = useRef(null);

  // Хуки должны быть вызваны ДО любого условного возврата
  useEffect(() => {
    if (data && data.datasets && data.datasets[0] && data.datasets[0].data.length > 0) {
      if (chartRef.current) {
        const chart = chartRef.current;
        chart.update();
      }
    }
  }, [data, resistanceLevels]);

  // Проверка на наличие данных (условный возврат)
  if (!data || !data.datasets || !data.datasets[0] || !data.datasets[0].data || data.datasets[0].data.length === 0) {
    return <div>No data available</div>;
  }

  // Преобразуем данные в формат, который ожидает chart.js
  const chartData = {
    datasets: [
      {
        label: 'Line Data',
        data: data.datasets[0].data.map((item) => ({
          x: new Date(item.openTime),
          y: item.close, // Используем цену закрытия для линейного графика
        })),
        borderColor: '#FFA500', // Цвет линии
        backgroundColor: 'rgba(0, 255, 0, 0.1)', // Заливка под линией
        borderWidth: 2,
        pointRadius: 0, // Убираем точки на графике
        fill: true, // Заливка под линией
      },
    ],
  };

  // Настройки для аннотаций (уровни сопротивления и поддержки)
  const annotations = {
    annotations: {},
  };

  // Добавляем уровни high-max (красные линии)
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

  // Добавляем уровни frequent-high (синие линии)
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

  // Добавляем сетку Фибоначчи
  if (resistanceLevels?.fibonacciLevelsResult?.mainResistances?.length > 0) {
    const fibLevels = resistanceLevels.fibonacciLevelsResult.mainResistances;

    // Цвета для каждого сегмента сетки
    const fibColors = ['rgba(0, 255, 0, 0.2)', 'rgba(0, 0, 255, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 165, 0, 0.2)'];

    // Создаем прямоугольники (сетку) между уровнями Фибоначчи
    for (let i = 0; i < fibLevels.length - 1; i++) {
      annotations.annotations[`fibonacci-box-${i}`] = {
        type: 'box',
        yMin: fibLevels[i + 1], // Нижний уровень
        yMax: fibLevels[i],     // Верхний уровень
        backgroundColor: fibColors[i % fibColors.length], // Цвет сегмента
        borderWidth: 0, // Без границы
      };
    }
  }

  // Добавляем уровни volume-clusters (зеленые линии)
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

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const { y } = context.raw;
            return `Price: ${y}`;
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
      annotation: annotations, // Добавляем аннотации (сетку Фибоначчи и другие уровни)
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
          min: new Date(data.datasets[0].data[data.datasets[0].data.length - 25].openTime).getTime(),
          max: new Date(data.datasets[0].data[data.datasets[0].data.length - 1].openTime).getTime() + (1000 * 60 * 5),
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
      <Chart ref={chartRef} type="line" data={chartData} options={options} />
    </div>
  );
};

export default LineChart;