export const chartData = {
  labels: [],
  datasets: [
    {
      label: "Price",
      data: [],
      borderColor: "rgb(75, 192, 192)",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      fill: true,
    },
  ],
};

export const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    tooltip: {
      enabled: true,
    },
    zoom: {
      wheel: {
        enabled: true,
      },
      pinch: {
        enabled: true,
      },
      drag: {
        enabled: true,
      },
      pan: {
        enabled: true,
        mode: 'xy',
      },
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "Time",
      },
    },
    y: {
      title: {
        display: true,
        text: "Price",
      },
    },
  },
};
