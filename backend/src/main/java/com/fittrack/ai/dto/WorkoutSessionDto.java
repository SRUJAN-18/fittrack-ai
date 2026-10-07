package com.fittrack.ai.dto;

import java.time.LocalDate;
import java.util.List;

public class WorkoutSessionDto {
    private Long id;
    private Long userId;
    private LocalDate sessionDate;
    private String workoutName;
    private String notes;
    private Integer durationMinutes;
    private String createdAt;
    private List<WorkoutExerciseDto> exercises;
    private int totalExercises;
    private double totalVolume;  // sum of (sets * reps * weight) across all exercises

    public WorkoutSessionDto() {}

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public List<WorkoutExerciseDto> getExercises() { return exercises; }
    public void setExercises(List<WorkoutExerciseDto> exercises) { this.exercises = exercises; }

    public int getTotalExercises() { return totalExercises; }
    public void setTotalExercises(int totalExercises) { this.totalExercises = totalExercises; }

    public double getTotalVolume() { return totalVolume; }
    public void setTotalVolume(double totalVolume) { this.totalVolume = totalVolume; }
}
