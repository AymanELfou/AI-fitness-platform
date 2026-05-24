package org.smarttrainer.backend.modules.coach.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class CoachProfileResponse {

    private Long id;
    private LocalDateTime createdAt;

    private Integer experience;
    private String certifications;
    private String speciality;
    private BigDecimal tariff;
    private Double rating;
    private Long clubId;
    private String clubName;
}