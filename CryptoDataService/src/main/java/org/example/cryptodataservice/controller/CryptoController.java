package org.example.cryptodataservice.controller;

import lombok.RequiredArgsConstructor;
import org.example.cryptodataservice.dto.TradingData;
import org.example.cryptodataservice.service.CryptoDataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3001")  // Разрешаем доступ только с фронтенда на localhost:3000
@RequestMapping("/history")
public class CryptoController {

    private final CryptoDataService dataService;

    @GetMapping("/candles")
    public ResponseEntity<List<TradingData>> getTradingData(@RequestParam String symbol,@RequestParam String interval,@RequestParam Integer size ) {
        return ResponseEntity.ok(dataService.getLastCandles(symbol, interval, size));
    }
}
