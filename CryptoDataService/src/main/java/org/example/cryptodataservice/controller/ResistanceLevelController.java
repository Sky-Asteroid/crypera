package org.example.cryptodataservice.controller;

import lombok.RequiredArgsConstructor;
import org.example.cryptodataservice.config.BinanceProperties;
import org.example.cryptodataservice.dto.ResponseResistanceLevel;
import org.example.cryptodataservice.dto.TradingData;
import org.example.cryptodataservice.service.BinanceLevelAnalyzerService;
import org.example.cryptodataservice.service.CryptoDataService;
import org.example.cryptodataservice.service.ResistanceLevelService;
import org.example.cryptodataservice.utils.TradingDataUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/level")
@RequiredArgsConstructor
public class ResistanceLevelController {
    private final BinanceLevelAnalyzerService analyzerService;
    private final ResistanceLevelService resistanceLevelService;
    private final BinanceProperties binanceProperties;
    private final CryptoDataService dataService;

    @GetMapping("high-max")
    public ResponseEntity<ResponseResistanceLevel> findByMaxHigh() {
        var symbol = binanceProperties.getSymbol();
        var interval = binanceProperties.getInterval();
        List<TradingData> data = dataService.getLastCandles(symbol, interval, 100);
        return ResponseEntity.ok(resistanceLevelService.findMaxHigh(data));
    }

    @GetMapping("frequent-high")
    public ResponseEntity<ResponseResistanceLevel> findByMostFrequentHigh() {
        var symbol = binanceProperties.getSymbol();
        var interval = binanceProperties.getInterval();
        List<TradingData> data = dataService.getLastCandles(symbol, interval, 150);
        return ResponseEntity.ok(resistanceLevelService.findMostFrequentHigh(data));
    }

    @GetMapping("fibbonachi-level")
    public ResponseEntity<ResponseResistanceLevel> findByFibonacciLevels() {
        var symbol = binanceProperties.getSymbol();
        var interval = binanceProperties.getInterval();
        List<TradingData> data = dataService.getLastCandles(symbol, interval, 100);
        return ResponseEntity.ok(resistanceLevelService.calculateFibonacciLevels(data));
    }

    @GetMapping("volume-clusters")
    public ResponseEntity<ResponseResistanceLevel> findByVolumeClusters() {
        var symbol = binanceProperties.getSymbol();
        var interval = binanceProperties.getInterval();
        List<TradingData> data = dataService.getLastCandles(symbol, interval, 100);
        return ResponseEntity.ok(resistanceLevelService.findVolumeClusters(data));
    }
}
