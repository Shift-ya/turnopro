package com.turnow.domain.tenant.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Configuración de branding y comportamiento de cada tenant.
 * Relación 1:1 con Tenant.
 */
@Entity
@Table(name = "tenant_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TenantSettings {

    @Id
    @Column(name = "tenant_id")
    private UUID tenantId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "tenant_id")
    private Tenant tenant;

    // ─── Branding ────────────────────────────────────────────────────────────

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(name = "primary_color", length = 7)
    @Builder.Default
    private String primaryColor = "#6366f1";

    @Column(name = "secondary_color", length = 7)
    @Builder.Default
    private String secondaryColor = "#8b5cf6";

    @Column(name = "welcome_message", length = 1000)
    private String welcomeMessage;

    // ─── Configuración de reservas ────────────────────────────────────────────

    /** Anticipación mínima para reservar en minutos */
    @Column(name = "min_advance_minutes")
    @Builder.Default
    private Integer minAdvanceMinutes = 60;

    /** Máximo de días hacia adelante para reservar */
    @Column(name = "max_advance_days")
    @Builder.Default
    private Integer maxAdvanceDays = 30;

    /** Permitir cancelaciones */
    @Column(name = "cancellations_allowed")
    @Builder.Default
    private Boolean cancellationsAllowed = true;

    /** Horas mínimas de anticipación para cancelar */
    @Column(name = "cancellation_hours_before")
    @Builder.Default
    private Integer cancellationHoursBefore = 2;

    // ─── Notificaciones ──────────────────────────────────────────────────────

    @Column(name = "send_confirmation_email")
    @Builder.Default
    private Boolean sendConfirmationEmail = true;

    @Column(name = "send_reminder_email")
    @Builder.Default
    private Boolean sendReminderEmail = true;

    @Column(name = "reminder_hours_before")
    @Builder.Default
    private Integer reminderHoursBefore = 24;

    // ─── Timezone ────────────────────────────────────────────────────────────

    @Column(name = "timezone", length = 50)
    @Builder.Default
    private String timezone = "America/Argentina/Buenos_Aires";

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
