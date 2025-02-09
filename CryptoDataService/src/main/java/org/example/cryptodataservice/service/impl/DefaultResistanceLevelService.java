package org.example.cryptodataservice.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.cryptodataservice.dto.ResponseExtremum;
import org.example.cryptodataservice.dto.ResponseResistanceLevel;
import org.example.cryptodataservice.dto.TradingData;
import org.example.cryptodataservice.enums.TrendType;
import org.example.cryptodataservice.service.FibonacciExtremumService;
import org.example.cryptodataservice.service.ResistanceLevelService;
import org.example.cryptodataservice.service.VolumeClusterAnalysisService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class DefaultResistanceLevelService implements ResistanceLevelService {

    private static final Logger log = LoggerFactory.getLogger(DefaultResistanceLevelService.class);

    private final VolumeClusterAnalysisService volumeClusterAnalysisService;
    private final FibonacciExtremumService fibonacciExtremumService;

    public ResponseResistanceLevel findMaxHigh(List<TradingData> data) {

        log.info("Trading data: {}", data);
        var maxHigh = data.stream()
                .map(TradingData::getHigh)
                .max(Double::compare);

        var trend = calculateSMA(data, 10, 50);

        var max =  maxHigh.map(high -> new ResponseResistanceLevel(
                List.of(high),
                null,
                null,
                trend
        )).orElse(new ResponseResistanceLevel(null, null, null));

        log.info("Max data: {}", max);

        return max;
    }
    public ResponseResistanceLevel findMostFrequentHigh(List<TradingData> data) {
        Map<Double, Long> highFrequencyMap = new HashMap<>();
        Map<Double, Long> lowFrequencyMap = new HashMap<>();

        // Разделение на высокие и низкие уровни для более точного анализа
        data.forEach(tradingData -> {
            highFrequencyMap.merge(tradingData.getHigh(), 1L, Long::sum);
            lowFrequencyMap.merge(tradingData.getLow(), 1L, Long::sum);
        });

        // Поиск максимальной частоты для высоких и низких уровней
        long maxHighFrequency = highFrequencyMap.values().stream()
                .max(Long::compareTo)
                .orElse(0L);

        long maxLowFrequency = lowFrequencyMap.values().stream()
                .max(Long::compareTo)
                .orElse(0L);

        // Получение самых частых уровней сопротивления
        var mostFrequentHighs = highFrequencyMap.entrySet().stream()
                .filter(entry -> entry.getValue() == maxHighFrequency)
                .map(Map.Entry::getKey)
                .toList();

        // Получение самых частых уровней поддержки
        var mostFrequentLows = lowFrequencyMap.entrySet().stream()
                .filter(entry -> entry.getValue() == maxLowFrequency)
                .map(Map.Entry::getKey)
                .toList();

        // Формирование списка основных уровней сопротивления
        List<Double> mainResistances = new ArrayList<>();
        if (!mostFrequentHighs.isEmpty()) {
            mainResistances.add(mostFrequentHighs.get(0)); // Основной уровень сопротивления
        }

        // Формирование списка основных уровней поддержки
        List<Double> mainSupports = new ArrayList<>();
        if (!mostFrequentLows.isEmpty()) {
            mainSupports.add(mostFrequentLows.get(0)); // Основной уровень поддержки
        }

        // Определение вторичных уровней сопротивления
        List<Double> secondaryResistances = new ArrayList<>();
        highFrequencyMap.entrySet().stream()
                .filter(entry -> entry.getValue() < maxHighFrequency)
                .forEach(entry -> {
                    if (entry.getValue() >= maxHighFrequency * 0.9) {
                        secondaryResistances.add(entry.getKey());
                    }
                });

        // Ограничение количества вторичных уровней до 5 самых частых
        List<Double> finalSecondaryResistances = secondaryResistances.size() > 5
                ? secondaryResistances.subList(0, 5)
                : secondaryResistances;

        // Формирование finalSecondaryResistances, включая уровни поддержки
        List<Double> finalResistances = new ArrayList<>(mainResistances);
        finalResistances.addAll(finalSecondaryResistances);
        finalResistances.addAll(mainSupports); // Добавляем уровень поддержки в finalResistances

        var trend = calculateSMA(data, 10, 50);

        return new ResponseResistanceLevel(mainResistances, finalSecondaryResistances, finalResistances, trend);
    }

    public TrendType calculateSMA(List<TradingData> data, int shortPeriod, int longPeriod) {
        if (data.size() < longPeriod) {
            return TrendType.NONE;
        }

        List<Double> closes = data.stream().map(TradingData::getClose).toList();

        double shortSMA = closes.subList(closes.size() - shortPeriod, closes.size())
                .stream().mapToDouble(Double::doubleValue).average().orElse(Double.NaN);

        double longSMA = closes.subList(closes.size() - longPeriod, closes.size())
                .stream().mapToDouble(Double::doubleValue).average().orElse(Double.NaN);

        if (Double.isNaN(shortSMA) || Double.isNaN(longSMA)) {
            return TrendType.NONE;
        }

        return shortSMA > longSMA ? TrendType.SUPPORT : (shortSMA < longSMA ? TrendType.RESISTANCE : TrendType.NONE);
    }

    public double calculateEMA(List<TradingData> data, int period) {
        if (data.size() < period) {
            return Double.NaN;
        }

        List<Double> closes = data.stream().map(TradingData::getClose).toList();
        double multiplier = 2.0 / (period + 1); // Весовой коэффициент EMA

        double ema = closes.subList(0, period).stream().mapToDouble(Double::doubleValue).average().orElse(Double.NaN);

        for (int i = period; i < closes.size(); i++) {
            ema = (closes.get(i) - ema) * multiplier + ema;
        }

        return ema;
    }

    public ResponseResistanceLevel findVolumeClusters(List<TradingData> tradingData) {
        Map<Double, List<TradingData>> priceClusters = volumeClusterAnalysisService.clusterByPriceLevel(tradingData);

        // Вычисляем объемы для каждого уровня
        Map<Double, Double> volumeByPriceLevel = volumeClusterAnalysisService.calculateVolumeByPriceLevel(priceClusters);

        // Вычисляем дельту объема для каждого уровня цен
        Map<Double, Double> deltaVolumeByPriceLevel = volumeClusterAnalysisService.calculateDeltaVolumeByPriceLevel(priceClusters);

        // Вычисляем порог на основе максимальной дельты объема
        double threshold = calculateThreshold(deltaVolumeByPriceLevel);

        // Логика для использования дельты объема, например, фильтрация по дельте
        // Например, выберем только те уровни, где дельта объема больше определенного порога
        volumeByPriceLevel.entrySet().removeIf(entry -> Math.abs(deltaVolumeByPriceLevel.get(entry.getKey())) < threshold);

        List<Double> maxVolume = volumeClusterAnalysisService.findMaxVolumeLevels(volumeByPriceLevel);

        var trend = calculateSMA(tradingData, 10, 50);


        return new ResponseResistanceLevel
                (maxVolume,
                null,
                null,
                        trend);
    }
    public ResponseResistanceLevel calculateFibonacciLevels(List<TradingData> data) {
        ResponseExtremum extremum = fibonacciExtremumService.findSimpleExtremum(data);

        log.info("extremum max: {}, extremum min: {}", extremum.getLocalMax(), extremum.getLocalMin());

        double avgMax = extremum.getLocalMax().isEmpty() ? Double.NaN : extremum.getLocalMax().stream().mapToDouble(val -> val).average().orElse(Double.NaN);
        double avgMin = extremum.getLocalMin().isEmpty() ? Double.NaN : extremum.getLocalMin().stream().mapToDouble(val -> val).average().orElse(Double.NaN);


        double range = avgMax - avgMin;
        double level236 = avgMax - range * 0.236;
        double level382 = avgMax - range * 0.382;
        double level50 = avgMax - range * 0.5;
        double level618 = avgMax - range * 0.618;

        var trend = calculateSMA(data, 10, 50);

        return new ResponseResistanceLevel(
                List.of(level236, level382, level50, level618),
                null,
                null,
                trend);
    }

    private static final double THRESHOLD_PERCENT = 0.05; // 5% от максимальной дельты объема

    private double calculateThreshold(Map<Double, Double> deltaVolumeByPriceLevel) {
        double maxDeltaVolume = deltaVolumeByPriceLevel.values().stream().max(Double::compareTo).orElse(0.0);
        return maxDeltaVolume * THRESHOLD_PERCENT;
    }

}
