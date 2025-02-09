package org.example.cryptodataservice.service.impl;

import org.example.cryptodataservice.dto.TradingData;
import org.example.cryptodataservice.service.VolumeClusterAnalysisService;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DefaultVolumeClusterAnalysisService implements VolumeClusterAnalysisService {

    private static final double PRICE_RANGE_PERCENTAGE = 0.005; // 0.5% диапазон

    @Override
    public Map<Double, List<TradingData>> clusterByPriceLevel(List<TradingData> tradingData) {
        if (tradingData.isEmpty()) {
            return Collections.emptyMap();
        }

        double averagePrice = tradingData.stream().mapToDouble(TradingData::getClose).average().orElse(0.0);
        double priceRange = averagePrice * PRICE_RANGE_PERCENTAGE;

        // Группируем данные по ценовым диапазонам
        Map<Double, List<TradingData>> clusters = new TreeMap<>();
        for (TradingData data : tradingData) {
            double price = data.getClose();
            double roundedPrice = Math.round(price / priceRange) * priceRange;
            clusters.computeIfAbsent(roundedPrice, k -> new ArrayList<>()).add(data);
        }

        return clusters;
    }


    public Map<Double, Double> calculateDeltaVolumeByPriceLevel(Map<Double, List<TradingData>> priceClusters) {
        Map<Double, Double> deltaVolumeByPriceLevel = new HashMap<>();

        for (Map.Entry<Double, List<TradingData>> entry : priceClusters.entrySet()) {
            double priceLevel = entry.getKey();
            double buyVolume = entry.getValue().stream().mapToDouble(TradingData::getBuyVolume).sum();
            double sellVolume = entry.getValue().stream().mapToDouble(TradingData::getSellVolume).sum();

            double deltaVolume = buyVolume - sellVolume; // Дельта объема
            deltaVolumeByPriceLevel.put(priceLevel, deltaVolume);
        }

        return deltaVolumeByPriceLevel;
    }

    @Override
    public Map<Double, Double> calculateVolumeByPriceLevel(Map<Double, List<TradingData>> priceClusters) {
        Map<Double, Double> volumeByPriceLevel = new HashMap<>();

        for (Map.Entry<Double, List<TradingData>> entry : priceClusters.entrySet()) {
            double priceLevel = entry.getKey();
            double totalVolume = entry.getValue().stream().mapToDouble(TradingData::getVolume).sum();
            double tradeCountWeight = entry.getValue().size(); // Количество сделок как весовой коэффициент

            volumeByPriceLevel.put(priceLevel, totalVolume * Math.log1p(tradeCountWeight)); // Учет веса
        }

        return volumeByPriceLevel;
    }

    @Override
    public List<Double> findMaxVolumeLevels(Map<Double, Double> volumeByPriceLevel) {
        double maxVolume = volumeByPriceLevel.values().stream().max(Double::compareTo).orElse(0.0);

        return volumeByPriceLevel.entrySet().stream()
                .filter(entry -> entry.getValue() == maxVolume)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    @Override
    public Map<Double, Double> calculateVolumeByTimePeriod(List<TradingData> tradingData, String period) {
        Map<Double, Double> volumeByTime = new TreeMap<>();
        Map<Double, List<TradingData>> groupedData = switch (period.toLowerCase()) {
            case "hour" -> tradingData.stream()
                    .collect(Collectors.groupingBy(data -> (double) data.getOpenTime().getHour())); // ✅ Исправлено
            case "day" -> tradingData.stream()
                    .collect(Collectors.groupingBy(data -> (double) data.getOpenTime().getDayOfMonth())); // ✅ Исправлено
            case "week" -> tradingData.stream()
                    .collect(Collectors.groupingBy(data -> (double) data.getOpenTime().getDayOfMonth() / 7.0)); // ✅ Исправлено
            default -> throw new IllegalArgumentException("Invalid period: " + period);
        };

        groupedData.forEach((key, value) ->
                volumeByTime.put(key, value.stream().mapToDouble(TradingData::getVolume).sum())
        );

        return volumeByTime;
    }

}
