package org.smarttrainer.backend.modules.token.repository;

import org.smarttrainer.backend.domain.token.Token;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token,Long> {

    Optional<Token> findByToken(String token);
}
