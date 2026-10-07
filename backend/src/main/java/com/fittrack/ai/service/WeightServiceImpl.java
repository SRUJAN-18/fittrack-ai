package com.fittrack.ai.service;

import com.fittrack.ai.dto.WeightRecordDto;
import com.fittrack.ai.dto.WeightRecordRequest;
import com.fittrack.ai.dto.WeightStatsDto;
import com.fittrack.ai.entity.User;
import com.fittrack.ai.entity.WeightRecord;
import com.fittrack.ai.exception.ResourceNotFoundException;
import com.fittrack.ai.repository.UserRepository;
import com.fittrack.ai.repository.WeightRecordRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WeightServiceImpl implements WeightService {

    private final WeightRecordRepository weightRecordRepository;
    private final UserRepository userRepository;

    public WeightServiceImpl(WeightRecordRepository weightRecordRepository, UserRepository userRepository) {
        this.weightRecordRepository = weightRecordRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public WeightRecordDto addWeightRecord(WeightRecordRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        LocalDate date = request.getRecordDate() != null ? request.getRecordDate() : LocalDate.now();

        WeightRecord record = new WeightRecord(user, request.getWeight(), date, request.getNotes());
        WeightRecord saved = weightRecordRepository.save(record);

        // Update user's current weight in profile if this is the newest or current record
        user.setWeight(request.getWeight());
        userRepository.save(user);

        return mapToDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WeightRecordDto> getUserWeightHistory(Long userId) {
        // Verify user exists
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }

        List<WeightRecord> records = weightRecordRepository.findByUserIdOrderByRecordDateAsc(userId);
        return records.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public WeightStatsDto getUserWeightStats(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        List<WeightRecord> records = weightRecordRepository.findByUserIdOrderByRecordDateAsc(userId);

        if (records.isEmpty()) {
            Double userWeight = user.getWeight() != null ? user.getWeight() : 0.0;
            return new WeightStatsDto(userWeight, userWeight, 0.0, userWeight, userWeight, 0, LocalDate.now());
        }

        Double startingWeight = records.get(0).getWeight();
        Double currentWeight = records.get(records.size() - 1).getWeight();
        Double netChange = Math.round((currentWeight - startingWeight) * 10.0) / 10.0;

        double highest = records.stream().mapToDouble(WeightRecord::getWeight).max().orElse(currentWeight);
        double lowest = records.stream().mapToDouble(WeightRecord::getWeight).min().orElse(currentWeight);
        LocalDate latestDate = records.get(records.size() - 1).getRecordDate();

        return new WeightStatsDto(
                currentWeight,
                startingWeight,
                netChange,
                Math.round(highest * 10.0) / 10.0,
                Math.round(lowest * 10.0) / 10.0,
                records.size(),
                latestDate
        );
    }

    @Override
    @Transactional
    public void deleteWeightRecord(Long recordId, Long userId) {
        WeightRecord record = weightRecordRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("Weight record not found with id: " + recordId));

        if (!record.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Unauthorized or weight record does not belong to user");
        }

        weightRecordRepository.delete(record);
    }

    private WeightRecordDto mapToDto(WeightRecord record) {
        return new WeightRecordDto(
                record.getId(),
                record.getUser().getId(),
                record.getWeight(),
                record.getRecordDate(),
                record.getNotes(),
                record.getCreatedAt()
        );
    }
}
