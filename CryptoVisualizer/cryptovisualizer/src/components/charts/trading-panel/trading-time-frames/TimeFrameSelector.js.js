import React, { useState } from "react";
import "./TimeFrameSelector.css";

const TimeFrameSelector = ({ selectedTimeFrame, onTimeFrameChange }) => {
  const timeFrameOptions = ["5m", "15m", "1h", "4h", "1d"];

  return (
    <div className="timeFrameSelector">
      <div className="options">
        {timeFrameOptions.map((option, index) => (
          <button
            key={index}
            className={`option-button ${selectedTimeFrame === option ? "active" : ""}`}
            onClick={() => onTimeFrameChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeFrameSelector;
