package com.turnopro.domain.availability.repository;

import com.turnopro.domain.availability.entity.Availability;
import com.turnopro.domain.availability.entity.AvailabilityBlock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AvailabilityRepository extends JpaRepository<Availability, UUID> {

    List<Availability> findByProfessionalIdAndActiveTrue(UUID professionalId);

    Optional<Availability> findByProfessionalIdAndDayOfWeek(UUID professionalId, DayOfWeek dayOfWeek);

    List<Availability> findByTenantIdAndProfessionalId(UUID tenantId, UUID professionalId);

    @Query("""
        SELECT a FROM Availability a
        WHERE a.professionalId = :professionalId
          AND a.dayOfWeek = :dayOfWeek
          AND a.active = true
    """)
    Optional<Availability> findActiveByProfessionalAndDay(
        @Param("professionalId") UUID professionalId,
        @Param("dayOfWeek") DayOfWeek dayOfWeek
    );
}
