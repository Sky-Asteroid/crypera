import React, { useEffect, useState } from 'react';
import { connectToWebSocket } from "../../service/websocketService";
import LineChart from '../charts/line-chart/LineChart.js';
import CandlestickChart from '../charts/candle-chart';
import moment from 'moment';

const WebSocketChartContainer = () => {
  const [chartData, setChartData] = useState([
    {
      name: 'Bitcoin',
      price_chart_data: [],
    },
  ]);

  useEffect(() => {
    const updateChartData = (newData) => {
        console.log('Received data:', newData);
      if (newData[0].openTime && newData[0].close) {
        const transformedData = {
          timestamp: moment(newData[0].openTime).toISOString(),
          price: newData[0].close,
        };

        setChartData((prevData) => {
          const updatedData = [...prevData];
          updatedData[0].price_chart_data.push([transformedData.timestamp, transformedData.price]);

          if (updatedData[0].price_chart_data.length > 50) {
            updatedData[0].price_chart_data.shift();
          }
          return updatedData;
        });
      }
    };

    const connect = connectToWebSocket(
      'http://localhost:8080/websocket',
      '/topic/live-data',
      updateChartData
    );
    
    return () => {
      connect();
    };
  }, []);

  const [chartType, setChartType] = useState('line');

  const handleChartToggle = () => {
    setChartType((prevType) => (prevType === 'line' ? 'candlestick' : 'line'));
  };

  return (
    <div>
      <h2>Bitcoin Price Chart</h2>
      <button onClick={handleChartToggle}>
        {chartType === 'line' ? 'Show Candlestick Chart' : 'Show Line Chart'}
      </button>
      {chartType === 'line' ? (
        <LineChart data={chartData} />
      ) : (
        <CandlestickChart data={chartData} />
      )}
    </div>
  );
};

export default WebSocketChartContainer;
