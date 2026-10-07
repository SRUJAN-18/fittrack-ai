package com.fittrack.ai.repository;

import com.fittrack.ai.entity.WorkoutSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkoutRepository extends JpaRepository<WorkoutSession, Long> {

    List<WorkoutSession> findByUserIdOrderBySessionDateDescCreatedAtDesc(Long userId);

    @Query("SELECT COUNT(w) FROM WorkoutSession w WHERE w.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(w.durationMinutes), 0) FROM WorkoutSession w WHERE w.user.id = :userId")
    long sumDurationByUserId(@Param("userId") Long userId);
}
