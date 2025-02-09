package org.example.cryptodataservice.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "crypto")
@Getter
@Setter
public class BinanceProperties {
    private String symbol;
    private String interval;
    private Long timeframe;
}
