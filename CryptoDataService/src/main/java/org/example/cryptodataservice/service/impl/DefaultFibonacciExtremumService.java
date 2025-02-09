package org.example.cryptodataservice.service.impl;

import org.example.cryptodataservice.dto.ResponseExtremum;
import org.example.cryptodataservice.dto.TradingData;
import org.example.cryptodataservice.service.FibonacciExtremumService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class DefaultFibonacciExtremumService implements FibonacciExtremumService {

    private static final Logger log = LoggerFactory.getLogger(DefaultResistanceLevelService.class);


    public ResponseExtremum findExtremumWithNewtonMethod(List<TradingData> data, int windowSize) {
        List<Double> localMax = new ArrayList<>();
        List<Double> localMin = new ArrayList<>();

        double[] highs = data.stream().mapToDouble(TradingData::getHigh).toArray();
        double[] lows = data.stream().mapToDouble(TradingData::getLow).toArray();

        highs = applyMovingAverage(highs, windowSize);
        lows = applyMovingAverage(lows, windowSize);

        log.info("Highs after smoothing: {}", Arrays.toString(highs));
        log.info("Lows after smoothing: {}", Arrays.toString(lows));

        for (int i = 1; i < data.size() - 1; i++) {
            double highDerivative = firstDerivative(i, highs);
            double lowDerivative = firstDerivative(i, lows);

            double highSecondDerivative = secondDerivative(i, highs);
            double lowSecondDerivative = secondDerivative(i, lows);

            double EPSILON = 1e-3; // Увеличил порог для большей чувствительности

            if (Math.abs(highDerivative) < EPSILON && highSecondDerivative < 0) {
                localMax.add(highs[i]);
            }
            if (Math.abs(lowDerivative) < EPSILON && lowSecondDerivative > 0) {
                localMin.add(lows[i]);
            }

            log.info("Index: {}, High: {}, FirstDerivative: {}, SecondDerivative: {}", i, highs[i], highDerivative, highSecondDerivative);
            log.info("Index: {}, Low: {}, FirstDerivative: {}, SecondDerivative: {}", i, lows[i], lowDerivative, lowSecondDerivative);
        }

        if (localMax.isEmpty() || localMin.isEmpty()) {
            log.warn("No extrema found in data! Ensure input data is sufficient and has variations.");
        }

        return new ResponseExtremum(localMax, localMin);
    }

    public ResponseExtremum findSimpleExtremum(List<TradingData> data) {
        List<Double> localMax = new ArrayList<>();
        List<Double> localMin = new ArrayList<>();

        for (int i = 1; i < data.size() - 1; i++) {
            TradingData current = data.get(i);

            if (current.getHigh() > data.get(i - 1).getHigh() && current.getHigh() > data.get(i + 1).getHigh()) {
                localMax.add(current.getHigh());
            }

            if (current.getLow() < data.get(i - 1).getLow() && current.getLow() < data.get(i + 1).getLow()) {
                localMin.add(current.getLow());
            }
        }


        return new ResponseExtremum(localMax, localMin);
    }

    public double[] applyMovingAverage(double[] data, int windowSize) {
        double[] smoothedData = new double[data.length];
        int halfWindow = windowSize / 2;

        for (int i = 0; i < data.length; i++) {
            if (i < halfWindow || i >= data.length - halfWindow) {
                smoothedData[i] = data[i];
            } else {
                double sum = 0;
                for (int j = -halfWindow; j <= halfWindow; j++) {
                    sum += data[i + j];
                }
                smoothedData[i] = sum / windowSize;
            }
        }

        return smoothedData;
    }

    public Double firstDerivative(int i, double[] values) {
        if (i <= 0) {
            return 0.0; // Возвращаем 0, если индекс слишком мал
        }
        return values[i] - values[i - 1];
    }

    public Double secondDerivative(int i, double[] values) {
        if (i <= 1) {
            return 0.0; // Возвращаем 0, если индекс слишком мал
        }
        return (values[i] - values[i - 1]) - (values[i - 1] - values[i - 2]);
    }


}
