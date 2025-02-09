package org.example.cryptodataservice.service;

import org.example.cryptodataservice.dto.ResponseResistanceLevel;
import org.example.cryptodataservice.dto.TradingData;
import org.example.cryptodataservice.enums.TrendType;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface ResistanceLevelService {

    //1m, 5m, 15m, 1h
    ResponseResistanceLevel findMaxHigh(List<TradingData> data);

    //5m, 15m, 1h, 4h, 1d
    ResponseResistanceLevel findMostFrequentHigh(List<TradingData> data);

    //1h, 4h, 1d, 1w
    TrendType calculateSMA(List<TradingData> data, int shortPeriod, int longPeriod);

    //1h, 4h, 1d, 1w
    double calculateEMA(List<TradingData> data, int period);


    //1m, 5m, 15m, 1h, 4h, 1d
    ResponseResistanceLevel findVolumeClusters(List<TradingData> data);

    //1h, 4h, 1d, 1w
    ResponseResistanceLevel calculateFibonacciLevels(List<TradingData> data);


}
