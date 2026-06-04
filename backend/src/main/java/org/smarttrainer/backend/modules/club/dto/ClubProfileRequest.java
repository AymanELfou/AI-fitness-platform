package org.smarttrainer.backend.modules.club.dto;

import lombok.Data;

@Data
public class ClubProfileRequest {
    private String clubName;
    private String localisation;
    private int capacity;
    private String contactEmail;
    private String phone;
}