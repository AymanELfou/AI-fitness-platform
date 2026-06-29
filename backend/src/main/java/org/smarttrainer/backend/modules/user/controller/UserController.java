package org.smarttrainer.backend.modules.user.controller;

import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.modules.user.dto.UserResponse;
import org.smarttrainer.backend.modules.user.dto.UserUpdateRequest;
import org.smarttrainer.backend.modules.user.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("api/v1/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.findAll());
    }

    @GetMapping("me")
    public ResponseEntity<UserResponse> getMe(Principal principal) {
        return ResponseEntity.ok(userService.getMe(principal.getName()));
    }

    @PutMapping("me")
    public ResponseEntity<UserResponse> updateMe(Principal principal, @RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(userService.updateMe(principal.getName(), request));
    }

    @GetMapping("{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    @PatchMapping("{id}/activate")
    public ResponseEntity<UserResponse> activateUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.activate(id));
    }

    @PatchMapping("{id}/deactivate")
    public ResponseEntity<UserResponse> deactivateUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.deactivate(id));
    }

    @PatchMapping("{id}/lock")
    public ResponseEntity<UserResponse> lockUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.lock(id));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
