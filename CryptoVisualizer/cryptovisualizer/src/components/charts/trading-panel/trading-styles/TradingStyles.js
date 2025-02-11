import React, { useState } from "react";
import "./TradingStyles.css";
import chartStyleImg from "../../../../image/chartStyle.png";

const TradingStyles = ({ onStyleChange }) => {
    const [showStyles, setShowStyles] = useState(false);
    const [selectedStyle, setSelectedStyle] = useState("Candlestick");
    const chartTypeOptions = ["Candlestick", "Line", "Bar"];

    const handleStyleSelect = (style) => {
        setSelectedStyle(style);
        if (onStyleChange) {
            onStyleChange(style);
        }
    };

    return (
        <div className="dropdown">
            <button
                className="dropdown-button"
                onClick={() => setShowStyles(!showStyles)}
            >
                <img
                    src={chartStyleImg}
                    alt="Chart Type"
                    style={{ width: '25px', height: '25px' }}
                />
            </button>
            {showStyles && (
                <div className="dropdown-content">
                    {chartTypeOptions.map((option, index) => (
                        <label key={index} className="radio-item">
                            <input
                                type="radio"
                                name="chartStyle"
                                value={option}
                                checked={selectedStyle === option}
                                onChange={() => handleStyleSelect(option)}
                            />
                            {option}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TradingStyles;