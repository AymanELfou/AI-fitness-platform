package org.smarttrainer.backend.modules.client.service;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.domain.client.ClientProfile;
import org.smarttrainer.backend.domain.client.SubscriptionPlan;
import org.smarttrainer.backend.domain.coach.CoachProfile;
import org.smarttrainer.backend.domain.club.ClubProfile;
import org.smarttrainer.backend.domain.user.User;
import org.smarttrainer.backend.modules.client.dto.ClientProfileRequest;
import org.smarttrainer.backend.modules.client.dto.ClientProfileResponse;
import org.smarttrainer.backend.modules.client.mapper.ClientMapper;
import org.smarttrainer.backend.modules.client.repository.ClientProfileRepository;
import org.smarttrainer.backend.modules.user.repository.UserRepository;
import org.smarttrainer.backend.modules.coach.repository.CoachProfileRepository;
import org.smarttrainer.backend.modules.club.repository.ClubProfileRepository;
import org.springframework.boot.autoconfigure.pulsar.PulsarProperties;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClientProfileService {

    private final ClientProfileRepository clientProfileRepository;
    private final UserRepository userRepository;
    private final ClientMapper clientMapper;
    private final CoachProfileRepository coachProfileRepository;
    private final ClubProfileRepository clubProfileRepository;

    @Transactional
    public ClientProfileResponse create(Long userId, ClientProfileRequest request) {
        if (clientProfileRepository.existsByUserId(userId)){
            throw  new RuntimeException("Client profile already exists for this user");
        }
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        ClientProfile profile = clientMapper.toEntity(request);
        profile.setUser(user);

        return clientMapper.toResponse(clientProfileRepository.save(profile));
    }

    public ClientProfileResponse getById(Long id){
        ClientProfile profile = clientProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client profile not found"));
            return clientMapper.toResponse(profile);
    }

    public ClientProfileResponse getByUserId(Long userId) {
        ClientProfile profile = clientProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Client profile not found"));
        return clientMapper.toResponse(profile);
    }

    public List<ClientProfileResponse> getAll() {
        return clientProfileRepository.findAll()
                .stream()
                .map(clientMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<ClientProfileResponse> getByClubId(Long clubId) {
        return clientProfileRepository.findByClubId(clubId)
                .stream()
                .map(clientMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ClientProfileResponse update(Long id, ClientProfileRequest request){
        ClientProfile profile = clientProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client profile not found"));

        profile.setAge(request.getAge());
        profile.setPoids(request.getPoids());
        profile.setTaille(request.getTaille());
        profile.setBut(request.getBut());
        profile.setNiveau(request.getNiveau());

        return clientMapper.toResponse(clientProfileRepository.save(profile));
    }

    @Transactional
    public void delete(Long id) {
        if (!clientProfileRepository.existsById(id)) {
            throw new RuntimeException("Client profile not found");
        }
        clientProfileRepository.deleteById(id);
    }

    // upgradeToPremium exige le club_id et le coach_id
    @Transactional
    public ClientProfileResponse upgradeToPremium(Long userId, Long clubId, Long coachId) {
        ClientProfile profile = clientProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Client profile not found"));
        
        // assignation strictes du club
        ClubProfile club = clubProfileRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Club not found"));
        profile.setClub(club);
        
        // assignation strictes du coach
        CoachProfile coach = coachProfileRepository.findById(coachId)
                .orElseThrow(() -> new RuntimeException("Coach not found"));
        profile.setCoach(coach);
        
        // Changement de plan d'abonnement en PREMIUM
        profile.setSubscriptionPlan(SubscriptionPlan.PREMIUM);
        return clientMapper.toResponse(clientProfileRepository.save(profile));
    }
}
