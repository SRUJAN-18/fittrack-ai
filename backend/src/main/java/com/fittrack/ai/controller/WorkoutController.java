package com.fittrack.ai.controller;

import com.fittrack.ai.dto.*;
import com.fittrack.ai.service.WorkoutService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workout")
public class WorkoutController {

    private final WorkoutService workoutService;

    public WorkoutController(WorkoutService workoutService) {
        this.workoutService = workoutService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<WorkoutSessionDto>> createSession(@Valid @RequestBody WorkoutSessionRequest request) {
        WorkoutSessionDto session = workoutService.createSession(request);
        return new ResponseEntity<>(ApiResponse.ok("Workout session logged successfully", session), HttpStatus.CREATED);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<List<WorkoutSessionDto>>> getUserSessions(@PathVariable Long userId) {
        List<WorkoutSessionDto> sessions = workoutService.getUserSessions(userId);
        return ResponseEntity.ok(ApiResponse.ok("Workout sessions retrieved successfully", sessions));
    }

    @GetMapping("/{userId}/stats")
    public ResponseEntity<ApiResponse<WorkoutStatsDto>> getUserStats(@PathVariable Long userId) {
        WorkoutStatsDto stats = workoutService.getUserStats(userId);
        return ResponseEntity.ok(ApiResponse.ok("Workout stats retrieved successfully", stats));
    }

    @DeleteMapping("/{sessionId}")
    public ResponseEntity<ApiResponse<String>> deleteSession(
            @PathVariable Long sessionId,
            @RequestParam Long userId) {
        workoutService.deleteSession(sessionId, userId);
        return ResponseEntity.ok(ApiResponse.ok("Workout session deleted successfully", null));
    }
}
