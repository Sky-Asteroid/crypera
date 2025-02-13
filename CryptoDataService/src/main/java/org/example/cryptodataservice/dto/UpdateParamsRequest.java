package org.example.cryptodataservice.dto;

public class UpdateParamsRequest {
    private String symbol;
    private String interval;

    // Геттеры и сеттеры
    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getInterval() {
        return interval;
    }

    public void setInterval(String interval) {
        this.interval = interval;
    }
}

