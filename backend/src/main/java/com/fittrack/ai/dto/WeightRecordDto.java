package com.fittrack.ai.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class WeightRecordDto {

    private Long id;
    private Long userId;
    private Double weight;
    private LocalDate recordDate;
    private String notes;
    private LocalDateTime createdAt;

    public WeightRecordDto() {
    }

    public WeightRecordDto(Long id, Long userId, Double weight, LocalDate recordDate, String notes, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.weight = weight;
        this.recordDate = recordDate;
        this.notes = notes;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
