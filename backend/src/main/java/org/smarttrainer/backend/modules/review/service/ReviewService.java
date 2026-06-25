package org.smarttrainer.backend.modules.review.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.domain.client.ClientProfile;
import org.smarttrainer.backend.domain.coach.CoachProfile;
import org.smarttrainer.backend.domain.review.Review;
import org.smarttrainer.backend.modules.client.repository.ClientProfileRepository;
import org.smarttrainer.backend.modules.coach.repository.CoachProfileRepository;
import org.smarttrainer.backend.modules.review.dto.ReviewRequest;
import org.smarttrainer.backend.modules.review.dto.ReviewResponse;
import org.smarttrainer.backend.modules.review.mapper.ReviewMapper;
import org.smarttrainer.backend.modules.review.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final CoachProfileRepository coachRepository;
    private final ClientProfileRepository clientRepository;
    private final ReviewMapper reviewMapper;

    @Transactional
    public ReviewResponse create(ReviewRequest request) {
        if (reviewRepository.existsByCoachIdAndClientId(
                request.getCoachId(), request.getClientId())) {
            throw new RuntimeException("You have already reviewed this coach");
        }

        if (request.getScore() < 1 || request.getScore() > 5) {
            throw new RuntimeException("Score must be between 1 and 5");
        }

        CoachProfile coach = coachRepository.findById(request.getCoachId())
                .orElseThrow(() -> new RuntimeException("Coach not found"));

        ClientProfile client = clientRepository.findById(request.getClientId())
                .orElseThrow(() -> new RuntimeException("Client not found"));

        Review review = reviewMapper.toEntity(request);
        review.setCoach(coach);
        review.setClient(client);

        return reviewMapper.toResponse(reviewRepository.save(review));
    }

    public List<ReviewResponse> getByCoachId(Long coachId) {
        return reviewRepository.findByCoachId(coachId)
                .stream()
                .map(reviewMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<ReviewResponse> getByClientId(Long clientId) {
        return reviewRepository.findByClientId(clientId)
                .stream()
                .map(reviewMapper::toResponse)
                .collect(Collectors.toList());
    }

    public Double getAverageRating(Long coachId) {
        Double rating = reviewRepository.getAverageRatingByCoachId(coachId);
        return rating != null ? rating : 0.0;
    }

    @Transactional
    public ReviewResponse update(Long id, ReviewRequest request) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (request.getScore() < 1 || request.getScore() > 5) {
            throw new RuntimeException("Score must be between 1 and 5");
        }

        review.setScore(request.getScore());
        review.setComment(request.getComment());

        return reviewMapper.toResponse(reviewRepository.save(review));
    }

    @Transactional
    public void delete(Long id) {
        if (!reviewRepository.existsById(id)) {
            throw new RuntimeException("Review not found");
        }
        reviewRepository.deleteById(id);
    }
}