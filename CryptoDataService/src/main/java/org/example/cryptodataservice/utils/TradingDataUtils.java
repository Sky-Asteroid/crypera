package org.example.cryptodataservice.utils;

import org.example.cryptodataservice.dto.TradingData;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.stream.Collectors;

public class TradingDataUtils {

    public static List<TradingData> convertToTradingDataList(List<List<Object>> rawData) {
        return rawData.stream()
                .map(data -> new TradingData(
                        convertToLocalDateTime(data.get(0)), // openTime
                        convertToDouble(data.get(1)),        // open
                        convertToDouble(data.get(2)),        // high
                        convertToDouble(data.get(3)),        // low
                        convertToDouble(data.get(4)),        // close
                        convertToDouble(data.get(5)),        // volume
                        convertToLocalDateTime(data.get(6)), // closeTime
                        convertToDouble(data.get(7)),        // quoteAssetVolume
                        convertToLong(data.get(8)),          // numberOfTrades
                        convertToDouble(data.get(9)),        // takerBuyBaseAssetVolume
                        convertToDouble(data.get(10)),       // takerBuyQuoteAssetVolume
                        convertToInteger(data.get(11))       // ignore
                ))
                .collect(Collectors.toList());
    }

    private static Double convertToDouble(Object obj) {
        if (obj instanceof String) {
            try {
                return Double.parseDouble((String) obj);
            } catch (NumberFormatException e) {
                return null;
            }
        } else if (obj instanceof Double) {
            return (Double) obj;
        }
        return null;
    }

    private static Long convertToLong(Object obj) {
        if (obj instanceof Integer) {
            return ((Integer) obj).longValue();
        } else if (obj instanceof Long) {
            return (Long) obj;
        }
        return null;
    }

    private static Integer convertToInteger(Object obj) {
        if (obj instanceof String) {
            try {
                return Integer.parseInt((String) obj);
            } catch (NumberFormatException e) {
                return null;
            }
        } else if (obj instanceof Integer) {
            return (Integer) obj;
        }
        return null;
    }

    private static LocalDateTime convertToLocalDateTime(Object obj) {
        if (obj instanceof Long) {
            return LocalDateTime.ofInstant(Instant.ofEpochMilli((Long) obj), ZoneOffset.UTC);
        }
        return null;
    }
}
