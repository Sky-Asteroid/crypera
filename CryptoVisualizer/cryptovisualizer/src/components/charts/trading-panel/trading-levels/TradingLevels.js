import React, { useState, useEffect } from "react";
import LevelService from "../../../../service/LevelService";
import "./TradingLevels.css";

const TradingLevels = ({ interval, symbol, onLevelsChange }) => {
    const [selectedMethods, setSelectedMethods] = useState({
        "high-max": false,
        "frequent-high": false,
        "fibonacci-level": false,
        "volume-clusters": false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    let maxHighResult, frequentHighResult, fibonacciLevelsResult, volumeClustersResult;

    const methodOptions = [
        { value: "high-max", label: "High Max" },
        { value: "frequent-high", label: "Frequent High" },
        { value: "fibonacci-level", label: "Fibonacci Level" },
        { value: "volume-clusters", label: "Volume Clusters" },
    ];

    const fetchLevels = async () => {
        setLoading(true);
        setError(null);
        try {
            if (selectedMethods["high-max"]) {
                maxHighResult = await LevelService.findMaxHigh(symbol, interval);
            } else {
                maxHighResult = null;
            }

            if (selectedMethods["frequent-high"]) {
                frequentHighResult = await LevelService.findMostFrequentHigh(symbol, interval);
            } else {
                frequentHighResult = null;
            }

            if (selectedMethods["fibonacci-level"]) {
                fibonacciLevelsResult = await LevelService.findFibonacciLevels(symbol, interval);
            } else {
                fibonacciLevelsResult = null;
            }

            if (selectedMethods["volume-clusters"]) {
                volumeClustersResult = await LevelService.findVolumeClusters(symbol, interval);
            } else {
                volumeClustersResult = null;
            }

            if (onLevelsChange) {
                onLevelsChange({
                    maxHighResult,
                    frequentHighResult,
                    fibonacciLevelsResult,
                    volumeClustersResult,
                });
            }
        } catch (err) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLevels();
    }, [selectedMethods, interval, symbol]);

    const handleCheckboxChange = (method) => {
        setSelectedMethods((prevSelectedMethods) => {
            const updatedMethods = {
                ...prevSelectedMethods,
                [method]: !prevSelectedMethods[method],
            };
            return updatedMethods;
        });
    };

    const closePopup = () => {
        setError(null);
    };

    return (
        <div className="dropdown-content">
            <div className="method-selection">
                {methodOptions.map((option) => (
                    <label key={option.value}>
                        <input
                            type="checkbox"
                            checked={selectedMethods[option.value]}
                            onChange={() => handleCheckboxChange(option.value)}
                        />
                        {option.label}
                    </label>
                ))}
            </div>

            {loading && (
                <div className="popup loading-popup">
                    <div className="popup-content">Loading...</div>
                </div>
            )}

            {error && (
                <div className="popup error-popup">
                    <div className="popup-content">
                        <p>{error}</p>
                        <button onClick={closePopup}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TradingLevels;
