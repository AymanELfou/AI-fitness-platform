package org.smarttrainer.backend.modules.coach.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.domain.club.ClubProfile;
import org.smarttrainer.backend.domain.coach.CoachProfile;
import org.smarttrainer.backend.domain.user.User;
import org.smarttrainer.backend.modules.club.repository.ClubProfileRepository;
import org.smarttrainer.backend.modules.coach.dto.CoachProfileRequest;
import org.smarttrainer.backend.modules.coach.dto.CoachProfileResponse;
import org.smarttrainer.backend.modules.coach.mapper.CoachProfileMapper;
import org.smarttrainer.backend.modules.coach.repository.CoachProfileRepository;
import org.smarttrainer.backend.modules.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CoachProfileService {

    private final CoachProfileRepository coachRepository;
    private final UserRepository userRepository;
    private final CoachProfileMapper coachMapper;
    private final ClubProfileRepository clubRepository;

    @Transactional
    public CoachProfileResponse create(Long userId, CoachProfileRequest request) {
        if (coachRepository.existsByUserId(userId)) {
            throw new RuntimeException("Coach profile already exists for this user");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ClubProfile club = clubRepository.findById(request.getClubId())
                .orElseThrow(() -> new RuntimeException("Club not found"));

        CoachProfile coach = coachMapper.toEntity(request);
        coach.setUser(user);
        coach.setClub(club);

        CoachProfile saved = coachRepository.save(coach);
        return coachMapper.toResponse(saved, getRating(saved.getId()));
    }

    public CoachProfileResponse getById(Long id) {
        CoachProfile coach = coachRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coach profile not found"));

        return coachMapper.toResponse(coach, getRating(id));
    }

    public CoachProfileResponse getByUserId(Long userId) {
        CoachProfile coach = coachRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Coach profile not found"));

        return coachMapper.toResponse(coach, getRating(coach.getId()));
    }

    public List<CoachProfileResponse> getAll() {
        return coachRepository.findAll()
                .stream()
                .map(coach -> coachMapper.toResponse(
                        coach,
                        getRating(coach.getId())
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public CoachProfileResponse update(Long id, CoachProfileRequest request) {

        CoachProfile coach = coachRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coach profile not found"));

        coach.setExperience(request.getExperience());
        coach.setCertifications(request.getCertifications());
        coach.setSpeciality(request.getSpeciality());
        coach.setTariff(request.getTariff());

        CoachProfile updated = coachRepository.save(coach);

        return coachMapper.toResponse(updated, getRating(id));
    }

    @Transactional
    public void delete(Long id) {
        if (!coachRepository.existsById(id)) {
            throw new RuntimeException("Coach profile not found");
        }
        coachRepository.deleteById(id);
    }

    private Double getRating(Long coachId) {
        Double rating = coachRepository.getAverageRating(coachId);
        return rating != null ? rating : 0.0;
    }
}