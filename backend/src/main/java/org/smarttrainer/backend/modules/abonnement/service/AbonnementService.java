package org.smarttrainer.backend.modules.abonnement.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.domain.abonnement.Abonnement;
import org.smarttrainer.backend.domain.abonnement.SubscriptionType;
import org.smarttrainer.backend.domain.club.ClubProfile;
import org.smarttrainer.backend.modules.abonnement.dto.AbonnementRequest;
import org.smarttrainer.backend.modules.abonnement.dto.AbonnementResponse;
import org.smarttrainer.backend.modules.abonnement.mapper.AbonnementMapper;
import org.smarttrainer.backend.modules.abonnement.repository.AbonnementRepository;
import org.smarttrainer.backend.modules.club.repository.ClubProfileRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AbonnementService {

    private final AbonnementRepository abonnementRepository;
    private final ClubProfileRepository clubRepository;
    private final AbonnementMapper abonnementMapper;

    @Transactional
    public AbonnementResponse create(AbonnementRequest request) {
        ClubProfile club = clubRepository.findById(request.getClubId())
                .orElseThrow(() -> new RuntimeException("Club not found"));

        Abonnement abonnement = abonnementMapper.toEntity(request);
        abonnement.setClub(club);

        return abonnementMapper.toResponse(abonnementRepository.save(abonnement));
    }

    public AbonnementResponse getById(Long id) {
        Abonnement abonnement = abonnementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Abonnement not found"));
        return abonnementMapper.toResponse(abonnement);
    }

    public List<AbonnementResponse> getAll() {
        return abonnementRepository.findAll()
                .stream()
                .map(abonnementMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<AbonnementResponse> getByClubId(Long clubId) {
        return abonnementRepository.findByClubId(clubId)
                .stream()
                .map(abonnementMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<AbonnementResponse> getByType(SubscriptionType type) {
        return abonnementRepository.findByType(type)
                .stream()
                .map(abonnementMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AbonnementResponse update(Long id, AbonnementRequest request) {
        Abonnement abonnement = abonnementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Abonnement not found"));

        abonnement.setType(request.getType());
        abonnement.setPrice(request.getPrice());
        abonnement.setDuration(request.getDuration());
        abonnement.setDescription(request.getDescription());

        return abonnementMapper.toResponse(abonnementRepository.save(abonnement));
    }

    @Transactional
    public void delete(Long id) {
        if (!abonnementRepository.existsById(id)) {
            throw new RuntimeException("Abonnement not found");
        }
        abonnementRepository.deleteById(id);
    }
}