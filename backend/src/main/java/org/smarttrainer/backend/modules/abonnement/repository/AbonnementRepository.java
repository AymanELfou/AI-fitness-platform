package org.smarttrainer.backend.modules.abonnement.repository;

import org.smarttrainer.backend.domain.abonnement.Abonnement;
import org.smarttrainer.backend.domain.abonnement.SubscriptionType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AbonnementRepository extends JpaRepository<Abonnement, Long> {
    List<Abonnement> findByClubId(Long clubId);
    List<Abonnement> findByType(SubscriptionType type);
}