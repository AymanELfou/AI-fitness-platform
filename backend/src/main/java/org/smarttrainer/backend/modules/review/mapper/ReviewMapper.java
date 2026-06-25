package org.smarttrainer.backend.modules.review.mapper;

import org.smarttrainer.backend.domain.review.Review;
import org.smarttrainer.backend.modules.review.dto.ReviewRequest;
import org.smarttrainer.backend.modules.review.dto.ReviewResponse;
import org.springframework.stereotype.Component;

@Component
public class ReviewMapper {

    public ReviewResponse toResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .coachId(review.getCoach().getId())
                .coachName(review.getCoach().getUser().fullName())
                .clientId(review.getClient().getId())
                .clientName(review.getClient().getUser().fullName())
                .score(review.getScore())
                .comment(review.getComment())
                .build();
    }

    public Review toEntity(ReviewRequest request) {
        Review review = new Review();
        review.setScore(request.getScore());
        review.setComment(request.getComment());
        return review;
    }
}