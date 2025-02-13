import React, { useState, useEffect } from 'react';
import KlineChart from '../kline/kline-chart/KlineChart';
import BarChart from '../bar/bar-chart/BarChart';
import LineChart from '../line-chart/LineChart';
import TradingPanel from '../trading-panel/TradingPanel';
import { connectToWebSocket } from '../../../service/websocketService';
import { SYMBOL, INTERVAL } from '../../../config';
import './ChartContainer.css';

const ChartContainer = () => {
    const [symbol, setSymbol] = useState(SYMBOL);
    const [interval, setInterval] = useState(INTERVAL);
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

    const fetchInitialData = async (symbol, interval) => {
        try {
            const response = await fetch(
                `http://localhost:8080/history/candles?symbol=${symbol}&interval=${interval}&size=100`
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

    const updateParams = async (symbol, interval) => {
        try {
            const response = await fetch('http://localhost:8080/update-params', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ symbol, interval }),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        } catch (error) {
            console.error('Ошибка при обновлении параметров:', error);
        }
    };

    useEffect(() => {
        fetchInitialData(symbol, interval);
    }, [symbol, interval]);

    useEffect(() => {
        const connect = connectToWebSocket(
            'http://localhost:8080/websocket',
            '/topic/live-data',
            updateCandles,
            { symbol, interval }
        );

        return () => {
            connect();
        };
    }, [symbol, interval]);

    const handleLevelsChange = (data) => {
        setResistanceLevels(data);
    };

    const handleStyleChange = (style) => {
        setChartStyle(style);
    };

    const handleSymbolChange = (newSymbol) => {
        setSymbol(newSymbol);
        updateParams(newSymbol, interval);
    };

    const handleIntervalChange = (newInterval) => {
        setInterval(newInterval);
        updateParams(symbol, newInterval);
    };

    if (isLoading) return <div>Загрузка данных...</div>;
    if (error) return <div>Ошибка: {error}</div>;

    return (
        <div className="klineContainer">
            <div className="panel-container">
                <div className="trading-panel">
                    <TradingPanel
                        onLevelsChange={handleLevelsChange}
                        onStyleChange={handleStyleChange}
                        onSymbolChange={handleSymbolChange}
                        onIntervalChange={handleIntervalChange}
                    />
                </div>
                <div className="klineChart">
                    {chartStyle === 'Candlestick' && (
                        <KlineChart
                            data={{ datasets: [{ data: candles }] }}
                            resistanceLevels={resistanceLevels}
                            intervalPad={interval}
                        />
                    )}
                    {chartStyle === 'Line' && (
                        <LineChart
                            data={{ datasets: [{ data: candles }] }}
                            resistanceLevels={resistanceLevels}
                            intervalPad={interval}
                        />
                    )}
                    {chartStyle === 'Bar' && (
                        <BarChart
                            data={{ datasets: [{ data: candles }] }}
                            resistanceLevels={resistanceLevels}
                            intervalPad={interval}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChartContainer;