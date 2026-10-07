package com.fittrack.ai.service;

import com.fittrack.ai.dto.AuthResponse;
import com.fittrack.ai.dto.LoginRequest;
import com.fittrack.ai.dto.RegisterRequest;
import com.fittrack.ai.dto.UserProfileDto;
import com.fittrack.ai.entity.User;
import com.fittrack.ai.entity.WeightRecord;
import com.fittrack.ai.exception.BadRequestException;
import com.fittrack.ai.exception.ResourceNotFoundException;
import com.fittrack.ai.repository.UserRepository;
import com.fittrack.ai.repository.WeightRecordRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final WeightRecordRepository weightRecordRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository,
                           WeightRecordRepository weightRecordRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.weightRecordRepository = weightRecordRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new BadRequestException("An account with this email already exists");
        }

        User user = new User();
        user.setEmail(normalizedEmail);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName().trim());
        user.setAge(request.getAge());
        user.setHeight(request.getHeight());
        user.setWeight(request.getWeight());
        user.setActivityLevel(request.getActivityLevel() != null ? request.getActivityLevel() : "Moderately Active");
        user.setFitnessGoal(request.getFitnessGoal() != null ? request.getFitnessGoal() : "Healthy Lifestyle");

        User savedUser = userRepository.save(user);

        // If initial weight was supplied during registration, seed initial weight record
        if (request.getWeight() != null && request.getWeight() > 0) {
            WeightRecord initialRecord = new WeightRecord(savedUser, request.getWeight(), LocalDate.now(), "Initial starting weight");
            weightRecordRepository.save(initialRecord);
        }

        String token = "fittrack-token-" + UUID.randomUUID().toString();
        return AuthResponse.success("User registered successfully", savedUser.getId(), savedUser.getName(), savedUser.getEmail(), token);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        String token = "fittrack-token-" + UUID.randomUUID().toString();
        return AuthResponse.success("Login successful", user.getId(), user.getName(), user.getEmail(), token);
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileDto getUserProfile(Long id) {
        User user = getUserEntity(id);
        return mapToDto(user);
    }

    @Override
    @Transactional
    public UserProfileDto updateUserProfile(Long id, UserProfileDto profileDto) {
        User user = getUserEntity(id);

        if (profileDto.getName() != null && !profileDto.getName().trim().isEmpty()) {
            user.setName(profileDto.getName().trim());
        }
        if (profileDto.getAge() != null) {
            user.setAge(profileDto.getAge());
        }
        if (profileDto.getHeight() != null && profileDto.getHeight() > 0) {
            user.setHeight(profileDto.getHeight());
        }
        if (profileDto.getWeight() != null && profileDto.getWeight() > 0) {
            user.setWeight(profileDto.getWeight());
        }
        if (profileDto.getActivityLevel() != null) {
            user.setActivityLevel(profileDto.getActivityLevel());
        }
        if (profileDto.getFitnessGoal() != null) {
            user.setFitnessGoal(profileDto.getFitnessGoal());
        }

        User updatedUser = userRepository.save(user);
        return mapToDto(updatedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public User getUserEntity(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    private UserProfileDto mapToDto(User user) {
        UserProfileDto dto = new UserProfileDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setAge(user.getAge());
        dto.setHeight(user.getHeight());
        dto.setWeight(user.getWeight());
        dto.setActivityLevel(user.getActivityLevel());
        dto.setFitnessGoal(user.getFitnessGoal());
        dto.setBmi(user.calculateBmi());
        dto.setBmiCategory(user.getBmiCategory());
        return dto;
    }
}
