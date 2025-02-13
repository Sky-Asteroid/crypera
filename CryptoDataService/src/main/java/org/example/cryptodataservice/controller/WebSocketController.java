package org.example.cryptodataservice.controller;

import lombok.RequiredArgsConstructor;
import org.example.cryptodataservice.config.BinanceProperties;
import org.example.cryptodataservice.dto.UpdateParamsRequest;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class WebSocketController {

    private BinanceProperties binanceProperties;

    @MessageMapping("/update-params")
    public void updateParams(UpdateParamsRequest request) {
        binanceProperties.setSymbol(request.getSymbol());
        binanceProperties.setInterval(request.getInterval());
    }
}
