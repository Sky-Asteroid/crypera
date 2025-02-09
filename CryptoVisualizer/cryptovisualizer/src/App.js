import React from 'react';
import './App.css';
import WebSocketCandleChartContainer from './components/WebSocketCandleChartContainer';
import KlineContainer from './components/charts/kline/kline-parent-container/KlineContainer';
import KlineChart from './components/charts/kline/kline-chart/KlineChart';

const candlestickData = {
  datasets: [
    {
      label: 'Candlestick Data',
      data: [
        { openTime: new Date('2023-10-01T00:00:00'), open: 29000, high: 29500, low: 28500, close: 29200 },
        { openTime: new Date('2023-10-01T01:00:00'), open: 29200, high: 29800, low: 29000, close: 29700 },
        { openTime: new Date('2023-10-01T02:00:00'), open: 29700, high: 30000, low: 29500, close: 29900 },
        { openTime: new Date('2023-10-01T03:00:00'), open: 29900, high: 30200, low: 29700, close: 30100 },
        { openTime: new Date('2023-10-01T04:00:00'), open: 30100, high: 30500, low: 30000, close: 30400 },
        { openTime: new Date('2023-10-01T05:00:00'), open: 30400, high: 30800, low: 30300, close: 30700 },
        { openTime: new Date('2023-10-01T06:00:00'), open: 30700, high: 31000, low: 30500, close: 30900 },
        { openTime: new Date('2023-10-01T07:00:00'), open: 30900, high: 31200, low: 30800, close: 31100 },
        { openTime: new Date('2023-10-01T08:00:00'), open: 31100, high: 31500, low: 31000, close: 31400 },
        { openTime: new Date('2023-10-01T09:00:00'), open: 31400, high: 31800, low: 31300, close: 31700 },
        { openTime: new Date('2023-10-01T10:00:00'), open: 31700, high: 32000, low: 31600, close: 31900 },
        { openTime: new Date('2023-10-01T11:00:00'), open: 31900, high: 32200, low: 31800, close: 32100 },
        { openTime: new Date('2023-10-01T12:00:00'), open: 32100, high: 32500, low: 32000, close: 32400 },
        { openTime: new Date('2023-10-01T13:00:00'), open: 32400, high: 32800, low: 32300, close: 32700 },
        { openTime: new Date('2023-10-01T14:00:00'), open: 32700, high: 33000, low: 32600, close: 32900 },
        { openTime: new Date('2023-10-01T15:00:00'), open: 32900, high: 33200, low: 32800, close: 33100 },
        { openTime: new Date('2023-10-01T16:00:00'), open: 33100, high: 33500, low: 33000, close: 33400 },
        { openTime: new Date('2023-10-01T17:00:00'), open: 33400, high: 33800, low: 33300, close: 33700 },
        { openTime: new Date('2023-10-01T18:00:00'), open: 33700, high: 34000, low: 33600, close: 33900 },
        { openTime: new Date('2023-10-01T19:00:00'), open: 33900, high: 34200, low: 33800, close: 34100 },
        { openTime: new Date('2023-10-01T20:00:00'), open: 34100, high: 34500, low: 34000, close: 34400 },
        { openTime: new Date('2023-10-01T21:00:00'), open: 34400, high: 34800, low: 34300, close: 34700 },
        { openTime: new Date('2023-10-01T22:00:00'), open: 34700, high: 35000, low: 34600, close: 34900 },
        { openTime: new Date('2023-10-01T23:00:00'), open: 34900, high: 35200, low: 34800, close: 35100 },
        { openTime: new Date('2023-10-02T00:00:00'), open: 35100, high: 35500, low: 35000, close: 35400 },
        { openTime: new Date('2023-10-02T01:00:00'), open: 35100, high: 35500, low: 35000, close: 35400 },
        { openTime: new Date('2023-10-02T02:00:00'), open: 35100, high: 35500, low: 35000, close: 35400 },
        { openTime: new Date('2023-10-02T03:00:00'), open: 35100, high: 35500, low: 35000, close: 35400 },
        { openTime: new Date('2023-10-02T04:00:00'), open: 35100, high: 35500, low: 35000, close: 35400 },
        { openTime: new Date('2023-10-02T05:00:00'), open: 35100, high: 35500, low: 35000, close: 35400 },
      ],
    },
  ],
};


// Фиктивные данные для уровней сопротивления и поддержки
const resistanceLevels = {
  mainResistances: [35000, 36000], // Основные уровни сопротивления
  secondaryResistances: [34000, 34500], // Второстепенные уровни сопротивления
  resetPoint: [33000], // Точки сброса
  trendType: 'UP', // Тип тренда
};


function App() {
  return (
    <div className="App">
      <main>
        <h1>Kline Chart with Resistance Levels</h1>
        <div style={{ width: '80%', height: '600px', margin: '0 auto' }}>
          <KlineContainer />
        </div>
        <div style={{ width: '80%', height: '600px', margin: '0 auto' }}>
          <KlineChart data={candlestickData} resistanceLevels={resistanceLevels} />
        </div>
        <WebSocketCandleChartContainer />
      </main>
    </div>
  );
}

export default App;
