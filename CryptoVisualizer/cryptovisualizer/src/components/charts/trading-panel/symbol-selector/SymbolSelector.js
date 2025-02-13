import React from "react";
import "./SymbolSelector.css";

const SymbolSelector = ({ selectedSymbol, onSymbolChange }) => {
  const symbols = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "ADAUSDT", "DOGEUSDT"]; // Пример списка символов

  return (
    <div className="symbolSelector">
      <select
        value={selectedSymbol}
        onChange={(e) => onSymbolChange(e.target.value)}
      >
        {symbols.map((symbol, index) => (
          <option key={index} value={symbol}>
            {symbol}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SymbolSelector;