package org.example.cryptodataservice.controller;

import lombok.RequiredArgsConstructor;
import org.example.cryptodataservice.config.BinaceParametrs;
import org.example.cryptodataservice.dto.UpdateParamsRequest;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ParamsController {

    private final BinaceParametrs binanceProperties;

    @PostMapping("/update-params")
    public void updateParams(@RequestBody UpdateParamsRequest request) {
        binanceProperties.setSymbol(request.getSymbol());
        binanceProperties.setInterval(request.getInterval());
    }
}