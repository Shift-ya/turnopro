package com.turnow.domain.availability.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.UUID;

/**
 * Disponibilidad semanal recurrente de un profesional.
 * Define los horarios de trabajo por día de semana.
 * Ej: Lunes de 09:00 a 18:00
 */
@Entity
@Table(
    name = "availabilities",
    indexes = {
        @Index(name = "idx_availability_professional", columnList = "professional_id"),
        @Index(name = "idx_availability_tenant", columnList = "tenant_id")
    },
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uq_availability_professional_day",
            columnNames = {"professional_id", "day_of_week"}
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Availability {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "professional_id", nullable = false)
    private UUID professionalId;

    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week", nullable = false, length = 20)
    private DayOfWeek dayOfWeek;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    /** Si está en false, ese día no trabaja */
    @Column(name = "active", nullable = false)
    @Builder.Default
    private Boolean active = true;

    /** Duración del slot en minutos (sobreescribe el del servicio si se define) */
    @Column(name = "slot_duration_minutes")
    private Integer slotDurationMinutes;

    // ─── Métodos de negocio ──────────────────────────────────────────────────

    public boolean isWorkday() {
        return active;
    }

    public boolean containsTime(LocalTime time) {
        return !time.isBefore(startTime) && !time.isAfter(endTime);
    }
}
