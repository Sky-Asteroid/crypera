package org.example.cryptodataservice.service;

import org.example.cryptodataservice.dto.TradingData;

import java.util.List;

public interface CryptoDataService {
    void fetchAndSendLiveWithInitialData();
    List<TradingData> getLastCandles(String symbol, String interval, Integer size);
}
