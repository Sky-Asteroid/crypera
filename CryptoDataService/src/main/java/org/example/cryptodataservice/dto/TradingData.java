package org.example.cryptodataservice.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TradingData {

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime openTime;

    private Double open;
    private Double high;
    private Double low;
    private Double close;
    private Double volume;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime closeTime;

    private Double quoteAssetVolume;
    private Long numberOfTrades;
    private Double takerBuyBaseAssetVolume;
    private Double takerBuyQuoteAssetVolume;
    private Integer ignore;

    private Double buyVolume;
    private Double sellVolume;

    public TradingData(LocalDateTime openTime, Double open, Double high, Double low, Double close,
                       Double volume, LocalDateTime closeTime, Double quoteAssetVolume,
                       Long numberOfTrades, Double takerBuyBaseAssetVolume,
                       Double takerBuyQuoteAssetVolume, Integer ignore) {
        this.openTime = openTime;
        this.open = open;
        this.high = high;
        this.low = low;
        this.close = close;
        this.volume = volume;
        this.closeTime = closeTime;
        this.quoteAssetVolume = quoteAssetVolume;
        this.numberOfTrades = numberOfTrades;
        this.takerBuyBaseAssetVolume = takerBuyBaseAssetVolume;
        this.takerBuyQuoteAssetVolume = takerBuyQuoteAssetVolume;
        this.ignore = ignore;
        this.buyVolume = takerBuyBaseAssetVolume;
        this.sellVolume = volume - takerBuyBaseAssetVolume;
    }

    @Override
    public String toString() {
        return "TradingData{" +
                "openTime=" + openTime +
                ", open=" + open +
                ", high=" + high +
                ", low=" + low +
                ", close=" + close +
                ", volume=" + volume +
                ", closeTime=" + closeTime +
                ", quoteAssetVolume=" + quoteAssetVolume +
                ", numberOfTrades=" + numberOfTrades +
                ", takerBuyBaseAssetVolume=" + takerBuyBaseAssetVolume +
                ", takerBuyQuoteAssetVolume=" + takerBuyQuoteAssetVolume +
                ", ignore=" + ignore +
                '}';
    }
}
