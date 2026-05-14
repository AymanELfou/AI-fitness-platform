package org.smarttrainer.backend.auth.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.auth.dto.AuthenticationRequest;
import org.smarttrainer.backend.auth.dto.AuthenticationResponse;
import org.smarttrainer.backend.auth.dto.RegistrationRequest;
import org.smarttrainer.backend.auth.service.LoginService;
import org.smarttrainer.backend.auth.service.LogoutService;
import org.smarttrainer.backend.auth.service.RegisterService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("auth")
@RequiredArgsConstructor
@Tag(name = "AuthenticationController")

@CrossOrigin(origins = "http://localhost:4200")
public class AuthentificationController {

    private final RegisterService registerService;
    private final LoginService loginService;
    private final LogoutService logoutService;

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


    //Logout end point
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request){
        String authHeader = request.getHeader("Authorization");
        logoutService.logout(authHeader);
        return ResponseEntity.ok().build();
    }
}
