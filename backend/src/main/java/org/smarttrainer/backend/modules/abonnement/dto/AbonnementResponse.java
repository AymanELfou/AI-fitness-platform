package org.smarttrainer.backend.modules.abonnement.dto;

import lombok.Builder;
import lombok.Data;
import org.smarttrainer.backend.domain.abonnement.SubscriptionType;

import java.time.LocalDateTime;

@Data
@Builder
public class AbonnementResponse {
    private Long id;
    private LocalDateTime createdAt;
    private SubscriptionType type;
    private Double price;
    private int duration;
    private String description;
    private Long clubId;
    private String clubName;
}