package org.example.cryptodataservice.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.cryptodataservice.client.BinanceClient;
import org.example.cryptodataservice.config.BinanceProperties;
import org.example.cryptodataservice.dto.TradingData;
import org.example.cryptodataservice.service.CryptoDataService;
import org.example.cryptodataservice.utils.TimeUtils;
import org.example.cryptodataservice.utils.TradingDataUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DefaultCryptoDataService implements CryptoDataService {
    private static final Logger log = LoggerFactory.getLogger(DefaultCryptoDataService.class);

    private final BinanceClient binanceClient;
    private final SimpMessagingTemplate messagingTemplate;
    private final BinanceProperties binanceProperties;

    @Scheduled(fixedRate = 2500)
    public void fetchAndSendLiveWithInitialData() {
        try {
            var symbol = binanceProperties.getSymbol();
            var interval = binanceProperties.getInterval();
            var endTime = Instant.now().toEpochMilli();
            var startTime = endTime - binanceProperties.getTimeframe();

            var rawData = binanceClient.getTradingData(symbol, interval, startTime, endTime);

            log.info("rawData: {}", rawData);
            var tradingDataList = TradingDataUtils.convertToTradingDataList(rawData);
            messagingTemplate.convertAndSend("/topic/live-data", tradingDataList);
            log.info("Live history data sent: {}\n\n\n", tradingDataList);
    } catch(
    Exception e)

    {
        log.error("Error fetching or sending live data\n\n\n", e);
    }
}


public List<TradingData> getLastCandles(String symbol, String interval, Integer size) {
    long endTime = Instant.now().toEpochMilli();
    long intervalMillis = TimeUtils.getIntervalInMillis(interval);
    long startTime = endTime - (size * intervalMillis);

    var rawData = binanceClient.getTradingData(symbol, interval, startTime, endTime);
    log.info("Fetched historical data from {} to {}", startTime, endTime);

    var tradingDataList = TradingDataUtils.convertToTradingDataList(rawData);
    if (tradingDataList.size() < size) {
        log.warn("Received only {} historical candles, expected 100.", tradingDataList.size());
    }

    return tradingDataList;
}
}
