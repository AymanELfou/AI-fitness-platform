package org.smarttrainer.backend.modules.availability.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.domain.availability.Availability;
import org.smarttrainer.backend.domain.coach.CoachProfile;
import org.smarttrainer.backend.modules.availability.dto.AvailabilityRequest;
import org.smarttrainer.backend.modules.availability.dto.AvailabilityResponse;
import org.smarttrainer.backend.modules.availability.mapper.AvailabilityMapper;
import org.smarttrainer.backend.modules.availability.repository.AvailabilityRepository;
import org.smarttrainer.backend.modules.coach.repository.CoachProfileRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AvailabilityService {

    private final AvailabilityRepository availabilityRepository;
    private final CoachProfileRepository coachRepository;
    private final AvailabilityMapper availabilityMapper;

    @Transactional
    public AvailabilityResponse create(AvailabilityRequest request) {
        CoachProfile coach = coachRepository.findById(request.getCoachId())
                .orElseThrow(() -> new RuntimeException("Coach not found"));

        Availability availability = availabilityMapper.toEntity(request);
        availability.setCoach(coach);

        return availabilityMapper.toResponse(availabilityRepository.save(availability));
    }

    public List<AvailabilityResponse> getByCoachId(Long coachId) {
        return availabilityRepository.findByCoachId(coachId)
                .stream()
                .map(availabilityMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<AvailabilityResponse> getFreeSlotsByCoachId(Long coachId) {
        return availabilityRepository.findByCoachIdAndIsAvailable(coachId, true)
                .stream()
                .map(availabilityMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AvailabilityResponse update(Long id, AvailabilityRequest request) {
        Availability availability = availabilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Availability not found"));

        availability.setStartTime(request.getStartTime());
        availability.setEndTime(request.getEndTime());

        return availabilityMapper.toResponse(availabilityRepository.save(availability));
    }

    @Transactional
    public void delete(Long id) {
        if (!availabilityRepository.existsById(id)) {
            throw new RuntimeException("Availability not found");
        }
        availabilityRepository.deleteById(id);
    }
}