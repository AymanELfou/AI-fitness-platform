package org.smarttrainer.backend.modules.user.service;

import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.domain.user.User;
import org.smarttrainer.backend.modules.user.dto.UserResponse;
import org.smarttrainer.backend.modules.user.dto.UserUpdateRequest;
import org.smarttrainer.backend.modules.user.mapper.UserMapper;
import org.smarttrainer.backend.modules.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Transactional(readOnly = true)
    public List<UserResponse> findAll() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public UserResponse findById(Long id) {
        return userMapper.toResponse(getUser(id));
    }

    @Transactional
    public UserResponse activate(Long id) {
        User user = getUser(id);
        user.setEnabled(true);
        user.setAccountLocked(false);
        return userMapper.toResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse deactivate(Long id) {
        User user = getUser(id);
        user.setEnabled(false);
        user.setAccountLocked(false);
        return userMapper.toResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse lock(Long id) {
        User user = getUser(id);
        user.setAccountLocked(true);
        user.setEnabled(false);
        return userMapper.toResponse(userRepository.save(user));
    }

    @Transactional
    public void delete(Long id) {
        User user = getUser(id);
        user.setEnabled(false);
        user.setAccountLocked(true);
        user.setFirstname("Deleted");
        user.setLastname("User");
        user.setEmail("deleted-user-" + id + "@smarttrainer.local");
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public UserResponse getMe(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));
        return userMapper.toResponse(user);
    }

    @Transactional
    public UserResponse updateMe(String email, UserUpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));
        
        if (request.getFirstname() != null) user.setFirstname(request.getFirstname());
        if (request.getLastname() != null) user.setLastname(request.getLastname());
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        
        return userMapper.toResponse(userRepository.save(user));
    }

    private User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
    }
}
