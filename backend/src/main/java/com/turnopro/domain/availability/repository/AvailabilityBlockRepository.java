package com.turnopro.domain.availability.repository;

import com.turnopro.domain.availability.entity.AvailabilityBlock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface AvailabilityBlockRepository extends JpaRepository<AvailabilityBlock, UUID> {

    List<AvailabilityBlock> findByProfessionalIdAndBlockDate(UUID professionalId, LocalDate date);

    @Query("""
        SELECT b FROM AvailabilityBlock b
        WHERE b.professionalId = :professionalId
          AND b.blockDate BETWEEN :from AND :to
    """)
    List<AvailabilityBlock> findByProfessionalAndDateRange(
        @Param("professionalId") UUID professionalId,
        @Param("from") LocalDate from,
        @Param("to") LocalDate to
    );
}
