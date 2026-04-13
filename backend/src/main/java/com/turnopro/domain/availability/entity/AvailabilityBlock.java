package com.turnopro.domain.availability.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

/**
 * Bloqueo manual de disponibilidad de un profesional.
 * Permite marcar períodos específicos como NO disponibles.
 * Ej: vacaciones, feriados, enfermedad.
 */
@Entity
@Table(
    name = "availability_blocks",
    indexes = {
        @Index(name = "idx_blocks_professional_date", columnList = "professional_id, block_date")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AvailabilityBlock {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "professional_id", nullable = false)
    private UUID professionalId;

    @Column(name = "block_date", nullable = false)
    private LocalDate blockDate;

    /** Si es null, bloquea TODO el día */
    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "reason", length = 500)
    private String reason;

    @Column(name = "created_by", nullable = false)
    private UUID createdBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // ─── Métodos de negocio ──────────────────────────────────────────────────

    public boolean isFullDayBlock() {
        return startTime == null && endTime == null;
    }

    public boolean conflictsWith(LocalTime time) {
        if (isFullDayBlock()) return true;
        return !time.isBefore(startTime) && time.isBefore(endTime);
    }
}
