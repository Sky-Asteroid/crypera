import React, { useEffect, useState } from 'react';
import { connectToWebSocket } from "../service/websocketService";  // Ваш сервис WebSocket
import CandlestickChart from './charts/candle-chart';  // Импорт вашего компонента для свечей

const WebSocketCandleChartContainer = () => {
    const [chartData, setChartData] = useState({
        datasets: [
            {
                label: 'Bitcoin Candlestick Data',
                data: [],  // Начинаем с пустого массива данных
                borderColor: '#333',
                color: {
                    up: '#00ff00',
                    down: '#ff0000',
                    unchanged: '#999999',
                },
                barThickness: 20,
            },
        ],
    });

    useEffect(() => {
        const updateChartData = (newData) => {
            console.log('Received data:', newData);  // Логирование полученных данных

            if (newData && newData[0] && newData[0].openTime && newData[0].close) {
                const newCandle = {
                    x: new Date(newData[0].openTime),  // Время открытия
                    o: newData[0].open,  // Открытие
                    h: newData[0].high,  // Высокая цена
                    l: newData[0].low,   // Низкая цена
                    c: newData[0].close, // Закрытие
                };

                setChartData((prevData) => {
                    const updatedData = [...prevData.datasets[0].data];
                    const newCandleTime = new Date(newCandle.x);
                    
                    // Найдем индекс свечи с тем же временем (до минуты)
                    const existingIndex = updatedData.findIndex(item => 
                        new Date(item.x).getTime() === newCandleTime.getTime()
                    );

                    if (existingIndex !== -1) {
                        // Заменим старую свечу, если она есть
                        updatedData[existingIndex] = newCandle;
                    } else {
                        // Добавим новую свечу
                        updatedData.push(newCandle);
                    }

                    if (updatedData.length > 50) {
                        updatedData.shift(); // Удаляем старые данные, если их больше 50
                    }

                    console.log('Updated chart data:', updatedData); // Логирование обновленных данных

                    return {
                        ...prevData,
                        datasets: [
                            {
                                ...prevData.datasets[0],
                                data: updatedData,
                            },
                        ],
                    };
                });
            }
        };

        const connect = connectToWebSocket(
            'http://localhost:8080/websocket',  // URL WebSocket сервера
            '/topic/live-data',                 // Тема
            updateChartData                     // Функция для обновления данных
        );

        return () => {
            connect(); // Закрытие подключения при размонтировании компонента
        };
    }, []);

    // Если данных нет, отображаем сообщение "Загружается..."
    if (chartData.datasets[0].data.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Bitcoin Price Chart</h2>
            <CandlestickChart data={chartData} />
        </div>
    );
};

export default WebSocketCandleChartContainer;
