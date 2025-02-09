package org.example.cryptodataservice.service;

import org.example.cryptodataservice.dto.ResponseExtremum;
import org.example.cryptodataservice.dto.TradingData;

import java.util.List;

public interface FibonacciExtremumService {

    ResponseExtremum findSimpleExtremum(List<TradingData> data);
    ResponseExtremum findExtremumWithNewtonMethod(List<TradingData> data, int windowSize);
    double[] applyMovingAverage(double[] data, int windowSize);
    Double firstDerivative(int i, double[] values);
    Double secondDerivative(int i, double[] values);
}
