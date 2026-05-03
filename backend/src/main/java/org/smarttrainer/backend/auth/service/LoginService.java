package org.smarttrainer.backend.auth.service;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.auth.dto.AuthenticationRequest;
import org.smarttrainer.backend.auth.dto.AuthenticationResponse;
import org.smarttrainer.backend.domain.user.User;
import org.smarttrainer.backend.security.service.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Data
@RequiredArgsConstructor
@Service
public class LoginService {

    final AuthenticationManager authenticationManager;
    final JwtService jwtService;

    public AuthenticationResponse login(AuthenticationRequest request){
        try{
            var auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                            )
            );
            var claims = new HashMap<String, Object>();
            var user = ((User)auth.getPrincipal());
            claims.put("fullName",user.fullName());
            var jwtToken = jwtService.generateToken(claims, user);
            return AuthenticationResponse.builder().token(jwtToken).build();
        }catch(Exception e) {
            System.out.println("LOGIN ERROR : " + e.getClass().getName() + " - " + e.getMessage());
            throw e;
        }
    }
}
