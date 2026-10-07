package com.fittrack.ai.dto;

public class WorkoutStatsDto {
    private long totalSessions;
    private long totalDurationMinutes;
    private long totalExercises;
    private double totalVolumeKg;
    private String lastSessionDate;
    private String mostUsedMuscleGroup;

    public WorkoutStatsDto() {}

    // Getters & Setters
    public long getTotalSessions() { return totalSessions; }
    public void setTotalSessions(long totalSessions) { this.totalSessions = totalSessions; }

    public long getTotalDurationMinutes() { return totalDurationMinutes; }
    public void setTotalDurationMinutes(long totalDurationMinutes) { this.totalDurationMinutes = totalDurationMinutes; }

    public long getTotalExercises() { return totalExercises; }
    public void setTotalExercises(long totalExercises) { this.totalExercises = totalExercises; }

    public double getTotalVolumeKg() { return totalVolumeKg; }
    public void setTotalVolumeKg(double totalVolumeKg) { this.totalVolumeKg = totalVolumeKg; }

    public String getLastSessionDate() { return lastSessionDate; }
    public void setLastSessionDate(String lastSessionDate) { this.lastSessionDate = lastSessionDate; }

    public String getMostUsedMuscleGroup() { return mostUsedMuscleGroup; }
    public void setMostUsedMuscleGroup(String mostUsedMuscleGroup) { this.mostUsedMuscleGroup = mostUsedMuscleGroup; }
}
