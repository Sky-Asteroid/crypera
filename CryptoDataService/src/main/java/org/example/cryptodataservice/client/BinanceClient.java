package org.example.cryptodataservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "binanceClient", url = "https://api.binance.com")
public interface BinanceClient {

    @GetMapping("/api/v3/klines")
    List<List<Object>> getTradingData(@RequestParam("symbol") String symbol,
                                     @RequestParam("interval") String interval,
                                     @RequestParam("startTime") Long startTime,
                                     @RequestParam("endTime") Long endTime);
}
