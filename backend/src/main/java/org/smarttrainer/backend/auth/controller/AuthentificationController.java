package org.smarttrainer.backend.auth.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.auth.dto.AuthenticationRequest;
import org.smarttrainer.backend.auth.dto.AuthenticationResponse;
import org.smarttrainer.backend.auth.dto.RegistrationRequest;
import org.smarttrainer.backend.auth.service.LoginService;
import org.smarttrainer.backend.auth.service.RegisterService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("auth")
@RequiredArgsConstructor
@Tag(name = "AuthenticationController")
public class AuthentificationController {

    private final RegisterService registerService;
    private final LoginService loginService;

    //Register end point
    @PostMapping(value = "/register")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<?> register(
            @RequestBody @Valid RegistrationRequest request
    ){
        registerService.register(request);
        return ResponseEntity.accepted().build();
    }

    //Login end point
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(
            @RequestBody @Valid AuthenticationRequest request){
        return ResponseEntity.ok(loginService.login(request));
    }
}
