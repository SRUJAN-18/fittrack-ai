package com.fittrack.ai.controller;

import com.fittrack.ai.dto.ApiResponse;
import com.fittrack.ai.dto.WeightRecordDto;
import com.fittrack.ai.dto.WeightRecordRequest;
import com.fittrack.ai.dto.WeightStatsDto;
import com.fittrack.ai.service.WeightService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/weight")
public class WeightController {

    private final WeightService weightService;

    public WeightController(WeightService weightService) {
        this.weightService = weightService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<WeightRecordDto>> addWeightRecord(@Valid @RequestBody WeightRecordRequest request) {
        WeightRecordDto record = weightService.addWeightRecord(request);
        return new ResponseEntity<>(ApiResponse.ok("Weight record logged successfully", record), HttpStatus.CREATED);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<List<WeightRecordDto>>> getWeightHistory(@PathVariable Long userId) {
        List<WeightRecordDto> history = weightService.getUserWeightHistory(userId);
        return ResponseEntity.ok(ApiResponse.ok("Weight history retrieved successfully", history));
    }

    @GetMapping("/{userId}/stats")
    public ResponseEntity<ApiResponse<WeightStatsDto>> getWeightStats(@PathVariable Long userId) {
        WeightStatsDto stats = weightService.getUserWeightStats(userId);
        return ResponseEntity.ok(ApiResponse.ok("Weight stats retrieved successfully", stats));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteWeightRecord(
            @PathVariable Long id,
            @RequestParam Long userId) {
        weightService.deleteWeightRecord(id, userId);
        return ResponseEntity.ok(ApiResponse.ok("Weight record deleted successfully", null));
    }
}
