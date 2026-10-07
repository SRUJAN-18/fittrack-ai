package com.fittrack.ai.service;

import com.fittrack.ai.dto.*;
import com.fittrack.ai.entity.User;
import com.fittrack.ai.entity.WorkoutExercise;
import com.fittrack.ai.entity.WorkoutSession;
import com.fittrack.ai.repository.UserRepository;
import com.fittrack.ai.repository.WorkoutRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class WorkoutServiceImpl implements WorkoutService {

    private final WorkoutRepository workoutRepository;
    private final UserRepository userRepository;

    public WorkoutServiceImpl(WorkoutRepository workoutRepository, UserRepository userRepository) {
        this.workoutRepository = workoutRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public WorkoutSessionDto createSession(WorkoutSessionRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        WorkoutSession session = new WorkoutSession();
        session.setUser(user);
        session.setSessionDate(request.getSessionDate());
        session.setWorkoutName(request.getWorkoutName());
        session.setNotes(request.getNotes());
        session.setDurationMinutes(request.getDurationMinutes());

        if (request.getExercises() != null) {
            int order = 0;
            for (WorkoutExerciseRequest exReq : request.getExercises()) {
                WorkoutExercise ex = new WorkoutExercise();
                ex.setSession(session);
                ex.setExerciseName(exReq.getExerciseName());
                ex.setMuscleGroup(exReq.getMuscleGroup());
                ex.setSets(exReq.getSets());
                ex.setReps(exReq.getReps());
                ex.setWeightKg(exReq.getWeightKg());
                ex.setDurationSeconds(exReq.getDurationSeconds());
                ex.setRestSeconds(exReq.getRestSeconds());
                ex.setSortOrder(exReq.getSortOrder() != null ? exReq.getSortOrder() : order++);
                session.getExercises().add(ex);
            }
        }

        WorkoutSession saved = workoutRepository.save(session);
        return toDto(saved);
    }

    @Override
    public List<WorkoutSessionDto> getUserSessions(Long userId) {
        return workoutRepository.findByUserIdOrderBySessionDateDescCreatedAtDesc(userId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public WorkoutStatsDto getUserStats(Long userId) {
        List<WorkoutSession> sessions = workoutRepository.findByUserIdOrderBySessionDateDescCreatedAtDesc(userId);

        WorkoutStatsDto stats = new WorkoutStatsDto();
        stats.setTotalSessions(sessions.size());
        stats.setTotalDurationMinutes(sessions.stream()
                .mapToLong(s -> s.getDurationMinutes() != null ? s.getDurationMinutes() : 0)
                .sum());

        long totalExercises = sessions.stream()
                .mapToLong(s -> s.getExercises().size())
                .sum();
        stats.setTotalExercises(totalExercises);

        double totalVolume = sessions.stream()
                .flatMap(s -> s.getExercises().stream())
                .mapToDouble(e -> {
                    int sets = e.getSets() != null ? e.getSets() : 0;
                    int reps = e.getReps() != null ? e.getReps() : 0;
                    double weight = e.getWeightKg() != null ? e.getWeightKg() : 0;
                    return sets * reps * weight;
                })
                .sum();
        stats.setTotalVolumeKg(Math.round(totalVolume * 10.0) / 10.0);

        if (!sessions.isEmpty()) {
            stats.setLastSessionDate(sessions.get(0).getSessionDate().toString());
        }

        // Find most used muscle group
        Map<String, Long> muscleGroupCount = sessions.stream()
                .flatMap(s -> s.getExercises().stream())
                .filter(e -> e.getMuscleGroup() != null && !e.getMuscleGroup().isBlank())
                .collect(Collectors.groupingBy(WorkoutExercise::getMuscleGroup, Collectors.counting()));

        muscleGroupCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .ifPresent(e -> stats.setMostUsedMuscleGroup(e.getKey()));

        return stats;
    }

    @Override
    @Transactional
    public void deleteSession(Long sessionId, Long userId) {
        WorkoutSession session = workoutRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Workout session not found"));
        if (!session.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized: cannot delete another user's session");
        }
        workoutRepository.delete(session);
    }

    private WorkoutSessionDto toDto(WorkoutSession session) {
        WorkoutSessionDto dto = new WorkoutSessionDto();
        dto.setId(session.getId());
        dto.setUserId(session.getUser().getId());
        dto.setSessionDate(session.getSessionDate());
        dto.setWorkoutName(session.getWorkoutName());
        dto.setNotes(session.getNotes());
        dto.setDurationMinutes(session.getDurationMinutes());
        if (session.getCreatedAt() != null) {
            dto.setCreatedAt(session.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        }

        List<WorkoutExerciseDto> exDtos = session.getExercises().stream()
                .sorted(Comparator.comparingInt(e -> (e.getSortOrder() != null ? e.getSortOrder() : 0)))
                .map(this::toExDto)
                .collect(Collectors.toList());
        dto.setExercises(exDtos);
        dto.setTotalExercises(exDtos.size());

        double vol = session.getExercises().stream().mapToDouble(e -> {
            int sets = e.getSets() != null ? e.getSets() : 0;
            int reps = e.getReps() != null ? e.getReps() : 0;
            double weight = e.getWeightKg() != null ? e.getWeightKg() : 0;
            return sets * reps * weight;
        }).sum();
        dto.setTotalVolume(Math.round(vol * 10.0) / 10.0);

        return dto;
    }

    private WorkoutExerciseDto toExDto(WorkoutExercise ex) {
        WorkoutExerciseDto dto = new WorkoutExerciseDto();
        dto.setId(ex.getId());
        dto.setExerciseName(ex.getExerciseName());
        dto.setMuscleGroup(ex.getMuscleGroup());
        dto.setSets(ex.getSets());
        dto.setReps(ex.getReps());
        dto.setWeightKg(ex.getWeightKg());
        dto.setDurationSeconds(ex.getDurationSeconds());
        dto.setRestSeconds(ex.getRestSeconds());
        dto.setSortOrder(ex.getSortOrder());
        return dto;
    }
}
