package com.fittrack.ai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public class WorkoutSessionRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Session date is required")
    private LocalDate sessionDate;

    @NotBlank(message = "Workout name is required")
    private String workoutName;

    private String notes;
    private Integer durationMinutes;
    private List<WorkoutExerciseRequest> exercises;

    // Getters & Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public LocalDate getSessionDate() { return sessionDate; }
    public void setSessionDate(LocalDate sessionDate) { this.sessionDate = sessionDate; }

    public String getWorkoutName() { return workoutName; }
    public void setWorkoutName(String workoutName) { this.workoutName = workoutName; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public List<WorkoutExerciseRequest> getExercises() { return exercises; }
    public void setExercises(List<WorkoutExerciseRequest> exercises) { this.exercises = exercises; }
}
