package org.smarttrainer.backend.auth.service;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.auth.dto.AuthenticationRequest;
import org.smarttrainer.backend.auth.dto.AuthenticationResponse;
import org.smarttrainer.backend.domain.token.Token;
import org.smarttrainer.backend.domain.token.TokenType;
import org.smarttrainer.backend.domain.user.User;
import org.smarttrainer.backend.modules.token.repository.TokenRepository;
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
    private final TokenRepository tokenRepository;


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
            //user Id must be included in the token
            claims.put("userId", user.getId());

            var jwtToken = jwtService.generateToken(claims, user);

            // ===== SAUVEGARDE DU TOKEN EN BASE =====
            var token = Token.builder()
                    .token(jwtToken)
                    .tokenType(TokenType.BEARER)
                    .user(user)
                    .revoked(false)
                    .expired(false)
                    .build();
            tokenRepository.save(token);

            return AuthenticationResponse.builder().token(jwtToken).build();

        }catch(Exception e) {
            System.out.println("LOGIN ERROR : " + e.getClass().getName() + " - " + e.getMessage());
            throw e;
        }
    }
}
