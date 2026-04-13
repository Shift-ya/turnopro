package com.turnopro.domain.professional.repository;

import com.turnopro.domain.professional.entity.Professional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProfessionalRepository extends JpaRepository<Professional, UUID> {

    List<Professional> findByTenantIdAndActiveTrue(UUID tenantId);

    List<Professional> findByTenantId(UUID tenantId);

    Optional<Professional> findByIdAndTenantId(UUID id, UUID tenantId);

    long countByTenantIdAndActiveTrue(UUID tenantId);

    /** Profesionales que ofrecen un servicio específico */
    @Query("""
        SELECT p FROM Professional p
        JOIN p.services s
        WHERE p.tenantId = :tenantId
          AND s.id = :serviceId
          AND p.active = true
    """)
    List<Professional> findByTenantIdAndServiceId(
        @Param("tenantId") UUID tenantId,
        @Param("serviceId") UUID serviceId
    );
}
