package com.fittrack.ai.controller;

import com.fittrack.ai.dto.ApiResponse;
import com.fittrack.ai.dto.UserProfileDto;
import com.fittrack.ai.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserProfileDto>> getUserProfile(@PathVariable Long id) {
        UserProfileDto profile = userService.getUserProfile(id);
        return ResponseEntity.ok(ApiResponse.ok("User profile fetched successfully", profile));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserProfileDto>> updateUserProfile(
            @PathVariable Long id,
            @RequestBody UserProfileDto profileDto) {
        UserProfileDto updatedProfile = userService.updateUserProfile(id, profileDto);
        return ResponseEntity.ok(ApiResponse.ok("User profile updated successfully", updatedProfile));
    }
}
