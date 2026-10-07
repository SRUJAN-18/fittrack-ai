package com.fittrack.ai.service;

import com.fittrack.ai.dto.AuthResponse;
import com.fittrack.ai.dto.LoginRequest;
import com.fittrack.ai.dto.RegisterRequest;
import com.fittrack.ai.dto.UserProfileDto;
import com.fittrack.ai.entity.User;

public interface UserService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    UserProfileDto getUserProfile(Long id);

    UserProfileDto updateUserProfile(Long id, UserProfileDto profileDto);

    User getUserEntity(Long id);
}
