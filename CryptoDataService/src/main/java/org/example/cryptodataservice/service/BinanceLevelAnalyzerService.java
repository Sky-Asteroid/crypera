package org.example.cryptodataservice.service;

import org.example.cryptodataservice.dto.ResponseResistanceLevel;

import java.util.List;

public interface BinanceLevelAnalyzerService {

    ResponseResistanceLevel findByMaxHigh(String symbol, String interval, Long startTime, Long endTime);

    //5m, 15m, 1h, 4h, 1d
    ResponseResistanceLevel findByMostFrequentHigh(String symbol, String interval, Long startTime, Long endTime);


    //1m, 5m, 15m, 1h, 4h, 1d
    ResponseResistanceLevel findByVolumeClusters(String symbol, String interval, Long startTime, Long endTime);

    //1h, 4h, 1d, 1w
    ResponseResistanceLevel findByFibonacciLevels(String symbol, String interval, Long startTime, Long endTime);
}
