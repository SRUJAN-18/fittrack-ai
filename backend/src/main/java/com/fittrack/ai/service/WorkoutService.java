package com.fittrack.ai.service;

import com.fittrack.ai.dto.WorkoutSessionDto;
import com.fittrack.ai.dto.WorkoutSessionRequest;
import com.fittrack.ai.dto.WorkoutStatsDto;

import java.util.List;

public interface WorkoutService {
    WorkoutSessionDto createSession(WorkoutSessionRequest request);
    List<WorkoutSessionDto> getUserSessions(Long userId);
    WorkoutStatsDto getUserStats(Long userId);
    void deleteSession(Long sessionId, Long userId);
}
