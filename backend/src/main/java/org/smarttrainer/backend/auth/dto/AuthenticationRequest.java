package org.smarttrainer.backend.auth.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthenticationRequest {

    @Email(message = "The email is not well formatted")
    @NotEmpty(message = "Email is required")
    @NotBlank(message = "Email is mandatory")
    private String email;
    @NotNull(message = "Password is required")
    @NotBlank(message = "Password is mandatory")
    @Size(min = 8, message = "Password should be 8 characters long minimum")
    private String password;
}
