package org.smarttrainer.backend.auth.service;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.auth.dto.RegistrationRequest;
import org.smarttrainer.backend.domain.user.Role;
import org.smarttrainer.backend.domain.user.User;
import org.smarttrainer.backend.modules.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Data
@RequiredArgsConstructor
public class RegisterService{

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void register(RegistrationRequest request) {
        Role selectedRole = request.getRole();

        User user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .accountLocked(false)
                .enabled(true)
                .roles(List.of(selectedRole))
                .build();

        userRepository.save(user);
    }
}
