import React, { useState, useEffect } from 'react';
import KlineChart from '../kline/kline-chart/KlineChart';
import BarChart from '../bar/bar-chart/BarChart';
import LineChart from '../line-chart/LineChart';
import TradingPanel from '../trading-panel/TradingPanel';
import { connectToWebSocket } from '../../../service/websocketService';
import { SYMBOL, INTERVAL } from '../../../config';
import './ChartContainer.css';

const ChartContainer = () => {
    const [candles, setCandles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [resistanceLevels, setResistanceLevels] = useState(null);
    const [chartStyle, setChartStyle] = useState('Candlestick');

    const updateCandles = (newData) => {
        console.log('Получены новые данные:', newData);

        if (newData && newData[0] && newData[0].openTime && newData[0].close) {
            const newCandle = {
                openTime: new Date(newData[0].openTime),
                open: newData[0].open,
                high: newData[0].high,
                low: newData[0].low,
                close: newData[0].close,
            };

            setCandles((prevCandles) => {
                const existingIndex = prevCandles.findIndex(
                    (candle) => candle.openTime.getTime() === newCandle.openTime.getTime()
                );

                if (existingIndex !== -1) {
                    const updatedCandles = [...prevCandles];
                    updatedCandles[existingIndex] = newCandle;
                    return updatedCandles;
                } else {
                    return [...prevCandles, newCandle];
                }
            });
        }
    };

    const fetchInitialData = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/history/candles?symbol=${SYMBOL}&interval=${INTERVAL}&size=100`
            );

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();

            const formattedData = data.map((item) => ({
                openTime: new Date(item.openTime),
                open: item.open,
                high: item.high,
                low: item.low,
                close: item.close,
            }));

            setCandles(formattedData);
            setIsLoading(false);
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
            setError(error.message);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        const connect = connectToWebSocket(
            'http://localhost:8080/websocket',
            '/topic/live-data',
            updateCandles
        );

        return () => {
            connect();
        };
    }, []);

    const handleLevelsChange = (data) => {
        console.log("Полученные уровни:", JSON.stringify(data, null, 2));
        setResistanceLevels(data);
    };

    const handleStyleChange = (style) => {
        console.log("Выбран стиль графика:", style);
        setChartStyle(style);
    };

    if (isLoading) return <div>Загрузка данных...</div>;
    if (error) return <div>Ошибка: {error}</div>;

    return (
        <div className="klineContainer">
            <div className="panel-container">
                <div className="trading-panel">
                    {/* Передаем handleStyleChange в TradingPanel */}
                    <TradingPanel
                        onLevelsChange={handleLevelsChange}
                        onStyleChange={handleStyleChange}
                    />
                </div>
                <div className="klineChart">
                    {/* Отображаем компоненту в зависимости от выбранного стиля */}
                    {chartStyle === 'Candlestick' && (
                        <KlineChart
                            data={{ datasets: [{ data: candles }] }}
                            resistanceLevels={resistanceLevels}
                        />
                    )}
                    {chartStyle === 'Line' && (
                        <LineChart
                            data={{ datasets: [{ data: candles }] }}
                            resistanceLevels={resistanceLevels}
                        />
                    )}
                    {chartStyle === 'Bar' && (
                        <BarChart
                            data={{ datasets: [{ data: candles }] }}
                            resistanceLevels={resistanceLevels}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChartContainer;