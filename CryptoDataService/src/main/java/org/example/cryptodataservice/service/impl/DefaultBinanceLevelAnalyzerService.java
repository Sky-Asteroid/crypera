package org.example.cryptodataservice.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.cryptodataservice.client.BinanceClient;
import org.example.cryptodataservice.dto.ResponseResistanceLevel;
import org.example.cryptodataservice.service.BinanceLevelAnalyzerService;
import org.example.cryptodataservice.service.ResistanceLevelService;
import org.example.cryptodataservice.utils.TradingDataUtils;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DefaultBinanceLevelAnalyzerService implements BinanceLevelAnalyzerService {

    private final BinanceClient binanceClient;
    private final ResistanceLevelService resistanceLevelService;
    public ResponseResistanceLevel findByMaxHigh(String symbol, String interval, Long startTime, Long endTime) {
        var rawData = binanceClient.getTradingData(symbol, interval, startTime, endTime);
        var tradingDataList = TradingDataUtils.convertToTradingDataList(rawData);

        return resistanceLevelService.findMaxHigh(tradingDataList);
    }

    public ResponseResistanceLevel findByMostFrequentHigh(String symbol, String interval, Long startTime, Long endTime) {
        var rawData = binanceClient.getTradingData(symbol, interval, startTime, endTime);
        var tradingDataList = TradingDataUtils.convertToTradingDataList(rawData);

        return resistanceLevelService.findMostFrequentHigh(tradingDataList);
    }

    public ResponseResistanceLevel findByVolumeClusters(String symbol, String interval, Long startTime, Long endTime) {
        var rawData = binanceClient.getTradingData(symbol, interval, startTime, endTime);
        var tradingDataList = TradingDataUtils.convertToTradingDataList(rawData);

        return resistanceLevelService.findVolumeClusters(tradingDataList);
    }
    
    public ResponseResistanceLevel findByFibonacciLevels(String symbol, String interval, Long startTime, Long endTime) {
        var rawData = binanceClient.getTradingData(symbol, interval, startTime, endTime);
        var tradingDataList = TradingDataUtils.convertToTradingDataList(rawData);

        return resistanceLevelService.calculateFibonacciLevels(tradingDataList);
    }
}
