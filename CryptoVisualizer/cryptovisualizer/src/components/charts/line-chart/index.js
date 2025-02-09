import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import moment from 'moment';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    zoomPlugin
);

const LineChart = (props) => {
    const { data } = props;

    const options = {
        responsive: true,
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    maxTicksLimit: 20,
                    padding: 10,
                },
                min: data[0].price_chart_data.length - 10,
                max: data[0].price_chart_data.length,
            },
        },
        plugins: {
            legend: {
                position: 'top',
            },
            zoom: {
                pan: {
                    enabled: true,
                    mode: 'xy',
                },
                zoom: {
                    wheel: {
                        enabled: true, 
                        speed: 0.05, 
                    },
                    mode: 'xy',
                },
            },
        },
    };

    const values = {
        labels: data[0].price_chart_data.map((element) =>
            moment(element[0]).format('DD.MM.YY')
        ),
        datasets: [
            {
                label:
                    data[0].name.charAt(0).toUpperCase() +
                    data[0].name.slice(1),
                data: data[0].price_chart_data.map(
                    (element) => element[1]
                ),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    return <Line options={options} data={values} width="100%" height="20%" />;
};

export default LineChart;
