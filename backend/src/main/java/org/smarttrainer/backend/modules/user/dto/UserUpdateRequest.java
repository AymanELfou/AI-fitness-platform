package org.smarttrainer.backend.modules.user.dto;

import lombok.Data;

@Data
public class UserUpdateRequest {
    private String firstname;
    private String lastname;
    private String email;
}
