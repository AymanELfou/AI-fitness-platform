package org.smarttrainer.backend.modules.abonnement.mapper;

import org.smarttrainer.backend.domain.abonnement.Abonnement;
import org.smarttrainer.backend.modules.abonnement.dto.AbonnementRequest;
import org.smarttrainer.backend.modules.abonnement.dto.AbonnementResponse;
import org.springframework.stereotype.Component;

@Component
public class AbonnementMapper {

    public AbonnementResponse toResponse(Abonnement abonnement) {
        return AbonnementResponse.builder()
                .id(abonnement.getId())
                .createdAt(abonnement.getCreatedAt())
                .type(abonnement.getType())
                .price(abonnement.getPrice())
                .duration(abonnement.getDuration())
                .description(abonnement.getDescription())
                .clubId(abonnement.getClub().getId())
                .clubName(abonnement.getClub().getClubName())
                .build();
    }

    public Abonnement toEntity(AbonnementRequest request) {
        Abonnement abonnement = new Abonnement();
        abonnement.setType(request.getType());
        abonnement.setPrice(request.getPrice());
        abonnement.setDuration(request.getDuration());
        abonnement.setDescription(request.getDescription());
        return abonnement;
    }
}