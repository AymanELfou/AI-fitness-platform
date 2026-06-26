package org.smarttrainer.backend.modules.client.mapper;

import org.smarttrainer.backend.domain.client.ClientProfile;
import org.smarttrainer.backend.modules.client.dto.ClientProfileRequest;
import org.smarttrainer.backend.modules.client.dto.ClientProfileResponse;
import org.springframework.stereotype.Component;

@Component
public class ClientMapper {

    public ClientProfileResponse toResponse(ClientProfile profile){

        return ClientProfileResponse.builder()
                .id(profile.getId())
                .createAt(profile.getCreatedAt())
                .userId(profile.getUser().getId())
                .age(profile.getAge())
                .poids(profile.getPoids())
                .taille(profile.getTaille())
                .but(profile.getBut())
                .niveau(profile.getNiveau())
                .imc(profile.getImc())
                .coachID(profile.getCoach() != null ? profile.getCoach().getId() : null)
                .clubId(profile.getClub() != null ? profile.getClub().getId() : null)
                .subscriptionPlan(profile.getSubscriptionPlan())
                // Add Members UserName to user Entity
                .userName(profile.getUser() != null ? profile.getUser().fullName() : null)
                .build();
    }

    public ClientProfile toEntity(ClientProfileRequest request){
        ClientProfile profile = new ClientProfile();
        profile.setAge(request.getAge());
        profile.setPoids(request.getPoids());
        profile.setTaille(request.getTaille());
        profile.setBut(request.getBut());
        profile.setNiveau(request.getNiveau());

        //Request to The Default Subscription Plan
        
        if (request.getSubscriptionPlan() != null && !request.getSubscriptionPlan().trim().isEmpty()) {
            try {
                profile.setSubscriptionPlan(org.smarttrainer.backend.domain.client.SubscriptionPlan.valueOf(request.getSubscriptionPlan().trim().toUpperCase()));
            } catch (IllegalArgumentException e) {
                profile.setSubscriptionPlan(org.smarttrainer.backend.domain.client.SubscriptionPlan.FREEMIUM);
            }
        } else {
            profile.setSubscriptionPlan(org.smarttrainer.backend.domain.client.SubscriptionPlan.FREEMIUM);
        }
        
        return profile;
    }
}
