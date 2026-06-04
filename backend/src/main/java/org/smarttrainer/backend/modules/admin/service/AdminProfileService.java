package org.smarttrainer.backend.modules.admin.service;

import jakarta.transaction.Transactional;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.domain.admin.AdminProfile;
import org.smarttrainer.backend.domain.user.User;
import org.smarttrainer.backend.modules.admin.dto.AdminProfileRequest;
import org.smarttrainer.backend.modules.admin.dto.AdminProfileResponse;
import org.smarttrainer.backend.modules.admin.mapper.AdminProfileMapper;
import org.smarttrainer.backend.modules.admin.repository.AdminProfileRepository;
import org.smarttrainer.backend.modules.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Data
public class AdminProfileService {

    private final AdminProfileRepository adminRepository;
    private final UserRepository userRepository;
    private final AdminProfileMapper adminMapper;

    @Transactional
    public AdminProfileResponse create(Long userId, AdminProfileRequest request) {
        if (adminRepository.existsByUserId(userId)) {
            throw new RuntimeException("Admin profile already exists for this user");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        AdminProfile profile = adminMapper.toEntity(request);
        profile.setUser(user);

        return adminMapper.toResponse(adminRepository.save(profile));
    }

    public AdminProfileResponse getById(Long id) {
        AdminProfile profile = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin profile not found"));
        return adminMapper.toResponse(profile);
    }

    public AdminProfileResponse getByUserId(Long userId) {
        AdminProfile profile = adminRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Admin profile not found"));
        return adminMapper.toResponse(profile);
    }

    public List<AdminProfileResponse> getAll() {
        return adminRepository.findAll()
                .stream()
                .map(adminMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AdminProfileResponse update(Long id, AdminProfileRequest request) {
        AdminProfile profile = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin profile not found"));
        profile.setPermissions(request.getPermissions());
        return adminMapper.toResponse(adminRepository.save(profile));
    }

    @Transactional
    public void delete(Long id) {
        if (!adminRepository.existsById(id)) {
            throw new RuntimeException("Admin profile not found");
        }
        adminRepository.deleteById(id);
    }
}