package org.example.cryptodataservice.utils;

public class TimeUtils {
    public static long getIntervalInMillis(String interval) {
        return switch (interval) {
            case "1m" -> 60 * 1000;
            case "5m" -> 5 * 60 * 1000;
            case "1h" -> 60 * 60 * 1000;
            case "1d" -> 24 * 60 * 60 * 1000;
            default -> throw new IllegalArgumentException("Unsupported interval: " + interval);
        };
    }
}
