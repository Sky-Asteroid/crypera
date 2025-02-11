import React, { useState } from "react";
import "./TradingPanel.css";
import calendarImg from "../../../image/calendar.png";
import indicatorImg from "../../../image/indicator.png";
import levelImg from "../../../image/level.png";
import TradingLevels from "./trading-levels/TradingLevels";
import TradingStyles from "./trading-styles/TradingStyles";
import TimeFrameSelector from "./trading-time-frames/TimeFrameSelector.js";
import { SYMBOL } from "../../../config";

const TradingPanel = ({ onLevelsChange, onStyleChange }) => {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("1h");
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

  return (
    <div className="tradingPanel">
      <div className="left-group">
        <TimeFrameSelector
          selectedTimeFrame={selectedTimeFrame}
          onTimeFrameChange={setSelectedTimeFrame}
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
              symbol={SYMBOL}
              onLevelsChange={handleLevelsChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TradingPanel;
