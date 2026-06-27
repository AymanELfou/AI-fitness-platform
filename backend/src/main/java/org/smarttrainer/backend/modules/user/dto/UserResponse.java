package org.smarttrainer.backend.modules.user.dto;

import lombok.Builder;
import lombok.Data;
import org.smarttrainer.backend.domain.user.Role;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String firstname;
    private String lastname;
    private String email;
    private List<Role> roles;
    private boolean enabled;
    private boolean accountLocked;
    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;
    private boolean profileCompleted;
}
