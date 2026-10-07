package com.fittrack.ai.repository;

import com.fittrack.ai.entity.WeightRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WeightRecordRepository extends JpaRepository<WeightRecord, Long> {

    List<WeightRecord> findByUserIdOrderByRecordDateAsc(Long userId);

    List<WeightRecord> findByUserIdOrderByRecordDateDesc(Long userId);

    Optional<WeightRecord> findTopByUserIdOrderByRecordDateDesc(Long userId);

    Optional<WeightRecord> findTopByUserIdOrderByRecordDateAsc(Long userId);
}
