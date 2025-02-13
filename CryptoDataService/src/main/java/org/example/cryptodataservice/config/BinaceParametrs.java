package org.example.cryptodataservice.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

@Component
@Getter
@Setter
public class BinaceParametrs {
    private String symbol = "BTCUSDT";  // Значение по умолчанию
    private String interval = "1m";     // Интервал по умолчанию
    private long timeframe = 60000;
}
