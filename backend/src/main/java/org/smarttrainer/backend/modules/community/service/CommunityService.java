package org.smarttrainer.backend.modules.community.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.domain.club.ClubProfile;
import org.smarttrainer.backend.domain.community.Community;
import org.smarttrainer.backend.modules.club.repository.ClubProfileRepository;
import org.smarttrainer.backend.modules.community.dto.CommunityRequest;
import org.smarttrainer.backend.modules.community.dto.CommunityResponse;
import org.smarttrainer.backend.modules.community.mapper.CommunityMapper;
import org.smarttrainer.backend.modules.community.repository.CommunityRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommunityService {

    private final CommunityRepository communityRepository;
    private final ClubProfileRepository clubRepository;
    private final CommunityMapper communityMapper;

    @Transactional
    public CommunityResponse create(CommunityRequest request) {
        if (communityRepository.existsByClubId(request.getClubId())) {
            throw new RuntimeException("Community already exists for this club");
        }

        ClubProfile club = clubRepository.findById(request.getClubId())
                .orElseThrow(() -> new RuntimeException("Club not found"));

        // only premium clubs can create a community
        if (club.getSubscriptionPlan().name().equals("FREEMIUM")) {
            throw new RuntimeException("Premium subscription required to create a community");
        }

        Community community = communityMapper.toEntity(request);
        community.setClub(club);

        return communityMapper.toResponse(communityRepository.save(community));
    }

    public CommunityResponse getById(Long id) {
        Community community = communityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Community not found"));
        return communityMapper.toResponse(community);
    }

    public CommunityResponse getByClubId(Long clubId) {
        Community community = communityRepository.findByClubId(clubId)
                .orElseThrow(() -> new RuntimeException("Community not found for this club"));
        return communityMapper.toResponse(community);
    }

    public List<CommunityResponse> getAll() {
        return communityRepository.findAll()
                .stream()
                .map(communityMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CommunityResponse update(Long id, CommunityRequest request) {
        Community community = communityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Community not found"));

        community.setName(request.getName());
        community.setDescription(request.getDescription());

        return communityMapper.toResponse(communityRepository.save(community));
    }

    @Transactional
    public void delete(Long id) {
        if (!communityRepository.existsById(id)) {
            throw new RuntimeException("Community not found");
        }
        communityRepository.deleteById(id);
    }
}