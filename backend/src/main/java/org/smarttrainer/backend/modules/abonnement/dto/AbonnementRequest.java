package org.smarttrainer.backend.modules.abonnement.dto;

import lombok.Data;
import org.smarttrainer.backend.domain.abonnement.SubscriptionType;

@Data
public class AbonnementRequest {
    private SubscriptionType type;
    private Double price;
    private int duration;
    private String description;
    private Long clubId;
}