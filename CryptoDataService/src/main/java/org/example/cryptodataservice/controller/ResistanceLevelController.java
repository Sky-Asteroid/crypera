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
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3001")
@RequestMapping("/level")
@RequiredArgsConstructor
public class ResistanceLevelController {
    private final ResistanceLevelService resistanceLevelService;
    private final CryptoDataService dataService;

    @GetMapping("high-max")
    public ResponseEntity<ResponseResistanceLevel> findByMaxHigh(
            @RequestParam String symbol,
            @RequestParam String interval) {
        List<TradingData> data = dataService.getLastCandles(symbol, interval, 100);
        return ResponseEntity.ok(resistanceLevelService.findMaxHigh(data));
    }

    @GetMapping("frequent-high")
    public ResponseEntity<ResponseResistanceLevel> findByMostFrequentHigh(
            @RequestParam String symbol,
            @RequestParam String interval) {
        List<TradingData> data = dataService.getLastCandles(symbol, interval, 150);
        return ResponseEntity.ok(resistanceLevelService.findMostFrequentHigh(data));
    }

    @GetMapping("fibonacci-level")
    public ResponseEntity<ResponseResistanceLevel> findByFibonacciLevels(
            @RequestParam String symbol,
            @RequestParam String interval) {
        List<TradingData> data = dataService.getLastCandles(symbol, interval, 100);
        return ResponseEntity.ok(resistanceLevelService.calculateFibonacciLevels(data));
    }


    @GetMapping("volume-clusters")
    public ResponseEntity<ResponseResistanceLevel> findByVolumeClusters(
            @RequestParam String symbol,
            @RequestParam String interval) {
        List<TradingData> data = dataService.getLastCandles(symbol, interval, 100);
        return ResponseEntity.ok(resistanceLevelService.findVolumeClusters(data));
    }

}
