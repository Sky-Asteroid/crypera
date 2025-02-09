package org.example.cryptodataservice.service;

import org.example.cryptodataservice.dto.TradingData;

import java.util.List;
import java.util.Map;

public interface VolumeClusterAnalysisService {
    Map<Double, List<TradingData>> clusterByPriceLevel(List<TradingData> tradingData);
    Map<Double, Double> calculateVolumeByPriceLevel(Map<Double, List<TradingData>> priceClusters);
    List<Double> findMaxVolumeLevels(Map<Double, Double> volumeByPriceLevel);
    Map<Double, Double> calculateVolumeByTimePeriod(List<TradingData> tradingData, String period);
    Map<Double, Double> calculateDeltaVolumeByPriceLevel(Map<Double, List<TradingData>> priceClusters);
}
