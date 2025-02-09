package org.example.cryptodataservice.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.cryptodataservice.enums.TrendType;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class ResponseResistanceLevel {
    private List<Double> mainResistances;
    private List<Double> secondaryResistances;
    private List<Double> resetPoint;
    private TrendType trendType;

    public ResponseResistanceLevel(List<Double> mainResistances, List<Double> secondaryResistances, List<Double> resetPoint) {
        this.mainResistances = mainResistances;
        this.secondaryResistances = secondaryResistances;
        this.resetPoint = resetPoint;
        this.trendType = TrendType.NONE;
    }
}
