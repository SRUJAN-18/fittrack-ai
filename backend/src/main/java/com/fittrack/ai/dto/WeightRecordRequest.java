package com.fittrack.ai.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

public class WeightRecordRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Weight is required")
    @Positive(message = "Weight must be positive")
    private Double weight;

    // Optional: defaults to LocalDate.now() if not provided
    private LocalDate recordDate;

    private String notes;

    public WeightRecordRequest() {
    }

    public WeightRecordRequest(Long userId, Double weight, LocalDate recordDate, String notes) {
        this.userId = userId;
        this.weight = weight;
        this.recordDate = recordDate;
        this.notes = notes;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public LocalDate getRecordDate() {
        return recordDate;
    }

    public void setRecordDate(LocalDate recordDate) {
        this.recordDate = recordDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
