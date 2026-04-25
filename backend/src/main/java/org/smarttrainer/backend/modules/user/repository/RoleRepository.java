package org.smarttrainer.backend.modules.user.repository;

import org.smarttrainer.backend.domain.user.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByRoleName(String roleName);
}
