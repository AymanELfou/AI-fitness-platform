package org.smarttrainer.backend.modules.coach.dto;

import lombok.Data;

@Data
public class CoachProfileRequest {

    private int experience;
    private String certifications;
    private String speciality;
    private double tariff;

}
