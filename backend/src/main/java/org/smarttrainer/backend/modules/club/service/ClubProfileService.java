package org.smarttrainer.backend.modules.club.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.domain.club.ClubProfile;
import org.smarttrainer.backend.domain.user.User;
import org.smarttrainer.backend.modules.club.dto.ClubProfileRequest;
import org.smarttrainer.backend.modules.club.dto.ClubProfileResponse;
import org.smarttrainer.backend.modules.club.mapper.ClubProfileMapper;
import org.smarttrainer.backend.modules.club.repository.ClubProfileRepository;
import org.smarttrainer.backend.modules.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClubProfileService {

    private final ClubProfileRepository clubRepository;
    private final UserRepository userRepository;
    private final ClubProfileMapper clubMapper;

    @Transactional
    public ClubProfileResponse create(Long userId, ClubProfileRequest request) {
        if (clubRepository.existsByUserId(userId)) {
            throw new RuntimeException("Club profile already exists for this user");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ClubProfile profile = clubMapper.toEntity(request);
        profile.setUser(user);

        return clubMapper.toResponse(clubRepository.save(profile));
    }

    public ClubProfileResponse getById(Long id) {
        ClubProfile profile = clubRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Club profile not found"));
        return clubMapper.toResponse(profile);
    }

    public ClubProfileResponse getByUserId(Long userId) {
        ClubProfile profile = clubRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Club profile not found"));
        return clubMapper.toResponse(profile);
    }

    public List<ClubProfileResponse> getAll() {
        return clubRepository.findAll()
                .stream()
                .map(clubMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ClubProfileResponse update(Long id, ClubProfileRequest request) {
        ClubProfile profile = clubRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Club profile not found"));

        profile.setClubName(request.getClubName());
        profile.setLocalisation(request.getLocalisation());
        profile.setCapacity(request.getCapacity());
        profile.setContactEmail(request.getContactEmail());
        profile.setPhone(request.getPhone());

        return clubMapper.toResponse(clubRepository.save(profile));
    }

    @Transactional
    public void delete(Long id) {
        if (!clubRepository.existsById(id)) {
            throw new RuntimeException("Club profile not found");
        }
        clubRepository.deleteById(id);
    }
}