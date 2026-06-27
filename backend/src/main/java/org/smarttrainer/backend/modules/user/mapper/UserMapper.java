package org.smarttrainer.backend.modules.user.mapper;

import org.smarttrainer.backend.domain.user.User;
import org.smarttrainer.backend.modules.user.dto.UserResponse;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .email(user.getEmail())
                .roles(user.getRoles())
                .enabled(user.isEnabled())
                .accountLocked(user.isAccountLocked())
                .createdDate(user.getCreatedDate())
                .modifiedDate(user.getModifiedDate())
                .profileCompleted(
                        user.getAdmin() != null
                                || user.getClient() != null
                                || user.getCoach() != null
                                || user.getClub() != null
                )
                .build();
    }
}
