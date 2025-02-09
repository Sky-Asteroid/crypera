package org.example.cryptodataservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseExtremum {
    private List<Double> localMax;
    private List<Double> localMin;
}
