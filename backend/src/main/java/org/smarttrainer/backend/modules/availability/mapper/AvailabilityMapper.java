package org.smarttrainer.backend.modules.availability.mapper;

import org.smarttrainer.backend.domain.availability.Availability;
import org.smarttrainer.backend.modules.availability.dto.AvailabilityRequest;
import org.smarttrainer.backend.modules.availability.dto.AvailabilityResponse;
import org.springframework.stereotype.Component;

@Component
public class AvailabilityMapper {

    public AvailabilityResponse toResponse(Availability availability) {
        return AvailabilityResponse.builder()
                .id(availability.getId())
                .coachId(availability.getCoach().getId())
                .startTime(availability.getStartTime())
                .endTime(availability.getEndTime())
                .isAvailable(availability.isAvailable())
                .build();
    }

    public Availability toEntity(AvailabilityRequest request) {
        Availability availability = new Availability();
        availability.setStartTime(request.getStartTime());
        availability.setEndTime(request.getEndTime());
        availability.setAvailable(true); // new slot is always free by default
        return availability;
        // coach is set in the service
    }
}