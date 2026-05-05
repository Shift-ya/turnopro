package com.turnow.domain.tenant.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entidad central del modelo multi-tenant.
 * Cada Tenant representa un negocio cliente en la plataforma.
 */
@Entity
@Table(name = "tenants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tenant {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    /** Slug único usado en URLs públicas: turnow.com/reserva/{slug} */
    @Column(name = "slug", unique = true, nullable = false, length = 100)
    private String slug;

    @Column(name = "business_name", nullable = false, length = 200)
    private String businessName;

    @Column(name = "email", nullable = false, length = 255)
    private String email;

    @Column(name = "phone", length = 50)
    private String phone;

    @Column(name = "address", length = 500)
    private String address;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "country", length = 100)
    private String country;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private TenantStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "plan", nullable = false, length = 20)
    private SubscriptionPlan plan;

    @Column(name = "plan_expires_at")
    private LocalDateTime planExpiresAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ─── Enums internos ──────────────────────────────────────────────────────

    public enum TenantStatus {
        ACTIVE, SUSPENDED, TRIAL, CANCELLED
    }

    public enum SubscriptionPlan {
        BASIC, PROFESSIONAL, PREMIUM;

        public int maxProfessionals() {
            return switch (this) {
                case BASIC -> 1;
                case PROFESSIONAL -> 5;
                case PREMIUM -> Integer.MAX_VALUE;
            };
        }

        public int maxServicesPerProfessional() {
            return switch (this) {
                case BASIC -> 5;
                case PROFESSIONAL -> 20;
                case PREMIUM -> Integer.MAX_VALUE;
            };
        }

        public boolean allowsCustomBranding() {
            return this == PROFESSIONAL || this == PREMIUM;
        }
    }

    // ─── Métodos de negocio ──────────────────────────────────────────────────

    public boolean isActive() {
        return status == TenantStatus.ACTIVE || status == TenantStatus.TRIAL;
    }

    public boolean isPlanExpired() {
        return planExpiresAt != null && planExpiresAt.isBefore(LocalDateTime.now());
    }
}
