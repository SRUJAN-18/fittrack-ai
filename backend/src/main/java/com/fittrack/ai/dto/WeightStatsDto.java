package com.fittrack.ai.dto;

import java.time.LocalDate;

public class WeightStatsDto {

    private Double currentWeight;
    private Double startingWeight;
    private Double netChange; // current - starting
    private Double highestWeight;
    private Double lowestWeight;
    private Integer totalEntries;
    private LocalDate latestDate;

    public WeightStatsDto() {
    }

    public WeightStatsDto(Double currentWeight, Double startingWeight, Double netChange, Double highestWeight, Double lowestWeight, Integer totalEntries, LocalDate latestDate) {
        this.currentWeight = currentWeight;
        this.startingWeight = startingWeight;
        this.netChange = netChange;
        this.highestWeight = highestWeight;
        this.lowestWeight = lowestWeight;
        this.totalEntries = totalEntries;
        this.latestDate = latestDate;
    }

    public Double getCurrentWeight() {
        return currentWeight;
    }

    public void setCurrentWeight(Double currentWeight) {
        this.currentWeight = currentWeight;
    }

    public Double getStartingWeight() {
        return startingWeight;
    }

    public void setStartingWeight(Double startingWeight) {
        this.startingWeight = startingWeight;
    }

    public Double getNetChange() {
        return netChange;
    }

    public void setNetChange(Double netChange) {
        this.netChange = netChange;
    }

    public Double getHighestWeight() {
        return highestWeight;
    }

    public void setHighestWeight(Double highestWeight) {
        this.highestWeight = highestWeight;
    }

    public Double getLowestWeight() {
        return lowestWeight;
    }

    public void setLowestWeight(Double lowestWeight) {
        this.lowestWeight = lowestWeight;
    }

    public Integer getTotalEntries() {
        return totalEntries;
    }

    public void setTotalEntries(Integer totalEntries) {
        this.totalEntries = totalEntries;
    }

    public LocalDate getLatestDate() {
        return latestDate;
    }

    public void setLatestDate(LocalDate latestDate) {
        this.latestDate = latestDate;
    }
}
