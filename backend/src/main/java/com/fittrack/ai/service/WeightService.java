package com.fittrack.ai.service;

import com.fittrack.ai.dto.WeightRecordDto;
import com.fittrack.ai.dto.WeightRecordRequest;
import com.fittrack.ai.dto.WeightStatsDto;

import java.util.List;

public interface WeightService {

    WeightRecordDto addWeightRecord(WeightRecordRequest request);

    List<WeightRecordDto> getUserWeightHistory(Long userId);

    WeightStatsDto getUserWeightStats(Long userId);

    void deleteWeightRecord(Long recordId, Long userId);
}
