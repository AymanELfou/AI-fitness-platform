package org.smarttrainer.backend.modules.client.dto;

import lombok.Builder;
import lombok.Data;
import org.smarttrainer.backend.domain.client.SubscriptionPlan;

import java.time.LocalDateTime;

@Data
@Builder
public class ClientProfileResponse {

    private Long id;
    private LocalDateTime createAt;
    private Long userId;
    private int age;
    private Double poids;
    private Double taille;
    private String but;
    private String niveau;
    private Double imc;
    private Long coachID;
    private Long clubId;
    private SubscriptionPlan subscriptionPlan;
}
