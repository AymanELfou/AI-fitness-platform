package org.smarttrainer.backend.modules.client.service;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.domain.client.ClientProfile;
import org.smarttrainer.backend.domain.client.SubscriptionPlan;
import org.smarttrainer.backend.domain.user.User;
import org.smarttrainer.backend.modules.client.dto.ClientProfileRequest;
import org.smarttrainer.backend.modules.client.dto.ClientProfileResponse;
import org.smarttrainer.backend.modules.client.mapper.ClientMapper;
import org.smarttrainer.backend.modules.client.repository.ClientProfileRepository;
import org.smarttrainer.backend.modules.user.repository.UserRepository;
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

    @Transactional
    public ClientProfileResponse upgradeToPremium(Long userId) {
        ClientProfile profile = clientProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Client profile not found"));
        profile.setSubscriptionPlan(SubscriptionPlan.PREMIUM);
        return clientMapper.toResponse(clientProfileRepository.save(profile));
    }
}
