import React, { useState } from "react";
import "./TradingPanel.css";
import calendarImg from "../../../image/calendar.png";
import indicatorImg from "../../../image/indicator.png";
import levelImg from "../../../image/level.png";
import TradingLevels from "./trading-levels/TradingLevels";
import TradingStyles from "./trading-styles/TradingStyles";
import TimeFrameSelector from "./trading-time-frames/TimeFrameSelector.js";
import SymbolSelector from "./symbol-selector/SymbolSelector.js";
import { SYMBOL, INTERVAL } from "../../../config";

const TradingPanel = ({
  onLevelsChange,
  onStyleChange,
  onSymbolChange, // Новый пропс для изменения символа
  onIntervalChange, // Новый пропс для изменения интервала
}) => {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState(INTERVAL);
  const [selectedSymbol, setSelectedSymbol] = useState(SYMBOL);
  const [showMovingDate, setShowMovingDate] = useState(false);
  const [showTechnicIndicators, setShowTechnicIndicators] = useState(false);
  const [showLevels, setShowLevels] = useState(false);
  const [levelsData, setLevelsData] = useState(null);

  const movingDateOptions = ["1 Day", "1 Week", "1 Month", "3 Months", "1 Year"];
  const technicIndicatorsOptions = ["RSI", "MACD", "Bollinger Bands", "Moving Average"];

  const handleLevelsChange = (data) => {
    setLevelsData(data);
    if (onLevelsChange) {
      onLevelsChange(data);
    }
  };

  const handleTimeFrameChange = (interval) => {
    setSelectedTimeFrame(interval);
    if (onIntervalChange) {
      onIntervalChange(interval); // Передаем новый интервал в родительский компонент
    }
  };

  const handleSymbolChange = (symbol) => {
    setSelectedSymbol(symbol);
    if (onSymbolChange) {
      onSymbolChange(symbol); // Передаем новый символ в родительский компонент
    }
  };

  return (
    <div className="tradingPanel">
      <div className="left-group">
        {/* Добавляем компонент для выбора символа */}
        <SymbolSelector selectedSymbol={selectedSymbol} onSymbolChange={handleSymbolChange} />

        {/* TimeFrameSelector с поддержкой изменения интервала */}
        <TimeFrameSelector
          selectedTimeFrame={selectedTimeFrame}
          onTimeFrameChange={handleTimeFrameChange}
        />
      </div>

      <div className="right-group">
        {/* Moving Date */}
        <div className="dropdown">
          <button
            className="dropdown-button"
            onClick={() => setShowMovingDate(!showMovingDate)}
          >
            <img src={calendarImg} alt="Moving Date" style={{ width: "25px", height: "25px" }} />
          </button>
          {showMovingDate && (
            <div className="dropdown-content">
              {movingDateOptions.map((option, index) => (
                <div key={index} className="dropdown-item">
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Technic Indicators */}
        <div className="dropdown">
          <button
            className="dropdown-button"
            onClick={() => setShowTechnicIndicators(!showTechnicIndicators)}
          >
            <img src={indicatorImg} alt="Technic Indicators" style={{ width: "25px", height: "25px" }} />
          </button>
          {showTechnicIndicators && (
            <div className="dropdown-content">
              {technicIndicatorsOptions.map((option, index) => (
                <div key={index} className="dropdown-item">
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chart Type */}
        <TradingStyles onStyleChange={onStyleChange} />

        {/* Levels */}
        <div className="dropdown">
          <button
            className="dropdown-button"
            onClick={() => setShowLevels(!showLevels)}
          >
            <img src={levelImg} alt="Levels" style={{ width: "25px", height: "25px" }} />
          </button>
          {showLevels && (
            <TradingLevels
              interval={selectedTimeFrame}
              symbol={selectedSymbol} // Используем выбранный символ
              onLevelsChange={handleLevelsChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TradingPanel;