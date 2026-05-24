package org.smarttrainer.backend.modules.coach.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CoachProfileRequest {

    @Min(0)
    private int experience;

    @NotBlank
    private String certifications;

    @NotBlank
    private String speciality;

    @NotNull
    @Positive
    private BigDecimal tariff;

}
