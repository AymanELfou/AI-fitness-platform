package org.smarttrainer.backend.modules.review.repository;

import org.smarttrainer.backend.domain.review.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByCoachId(Long coachId);
    List<Review> findByClientId(Long clientId);
    Optional<Review> findByCoachIdAndClientId(Long coachId, Long clientId);
    boolean existsByCoachIdAndClientId(Long coachId, Long clientId);

    @Query("SELECT AVG(r.score) FROM Review r WHERE r.coach.id = :coachId")
    Double getAverageRatingByCoachId(Long coachId);
}