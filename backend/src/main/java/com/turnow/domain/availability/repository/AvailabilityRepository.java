package com.turnow.domain.availability.repository;

import com.turnow.domain.availability.entity.Availability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
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
