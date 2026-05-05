package com.turnow.api;

import com.turnow.domain.tenant.entity.Tenant;
import com.turnow.domain.tenant.repository.TenantRepository;
import com.turnow.infrastructure.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/admin/super")
@RequiredArgsConstructor
public class SuperAdminController {

    private final TenantRepository tenantRepository;

    @GetMapping("/overview")
    public ResponseEntity<GlobalOverviewDto> overview() {
        List<Tenant> tenants = tenantRepository.findAll();
        long activeTenants = tenants.stream().filter(t -> t.getStatus() == Tenant.TenantStatus.ACTIVE).count();
        long basic = tenants.stream().filter(t -> t.getPlan() == Tenant.SubscriptionPlan.BASIC).count();
        long professional = tenants.stream().filter(t -> t.getPlan() == Tenant.SubscriptionPlan.PROFESSIONAL).count();
        long premium = tenants.stream().filter(t -> t.getPlan() == Tenant.SubscriptionPlan.PREMIUM).count();

        return ResponseEntity.ok(
            new GlobalOverviewDto(
                tenants.size(),
                activeTenants,
                0,
                0,
                0,
                new PlanDistributionDto(basic, professional, premium)
            )
        );
    }

    @GetMapping("/tenants")
    public ResponseEntity<List<TenantDto>> tenants(@RequestParam(required = false) String search) {
        String query = search == null ? "" : search.toLowerCase();
        List<TenantDto> response = tenantRepository.findAll().stream()
            .filter(t ->
                query.isBlank()
                    || t.getBusinessName().toLowerCase().contains(query)
                    || (t.getEmail() != null && t.getEmail().toLowerCase().contains(query))
            )
            .map(this::toDto)
            .toList();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/tenants")
    public ResponseEntity<TenantDto> createTenant(@RequestBody TenantCreateRequest request) {
        Tenant tenant = Tenant.builder()
            .businessName(request.name())
            .slug(request.slug())
            .email(request.email())
            .phone(request.phone())
            .address(request.address())
            .status(Tenant.TenantStatus.ACTIVE)
            .plan(Tenant.SubscriptionPlan.valueOf(request.plan()))
            .planExpiresAt(LocalDateTime.now().plusMonths(1))
            .build();
        return ResponseEntity.ok(toDto(tenantRepository.save(tenant)));
    }

    @PatchMapping("/tenants/{tenantId}/status")
    public ResponseEntity<TenantDto> updateStatus(@PathVariable UUID tenantId, @RequestBody TenantStatusRequest request) {
        Tenant tenant = tenantRepository.findById(tenantId)
            .orElseThrow(() -> new ResourceNotFoundException("Tenant no encontrado"));
        tenant.setStatus(Tenant.TenantStatus.valueOf(request.status()));
        return ResponseEntity.ok(toDto(tenantRepository.save(tenant)));
    }

    @DeleteMapping("/tenants/{tenantId}")
    public ResponseEntity<Void> deleteTenant(@PathVariable UUID tenantId) {
        Tenant tenant = tenantRepository.findById(tenantId)
            .orElseThrow(() -> new ResourceNotFoundException("Tenant no encontrado"));
        tenantRepository.delete(tenant);
        return ResponseEntity.noContent().build();
    }

    private TenantDto toDto(Tenant tenant) {
        return new TenantDto(
            tenant.getId().toString(),
            tenant.getBusinessName(),
            tenant.getSlug(),
            tenant.getEmail(),
            tenant.getPhone(),
            tenant.getAddress(),
            tenant.getStatus().name(),
            tenant.getPlan().name(),
            tenant.getCreatedAt() == null ? null : tenant.getCreatedAt().toString()
        );
    }

    public record GlobalOverviewDto(
        long totalTenants,
        long activeTenants,
        long totalAppointments,
        double totalRevenue,
        double monthlyGrowth,
        PlanDistributionDto activePlans
    ) {}

    public record PlanDistributionDto(long basic, long professional, long premium) {}

    public record TenantDto(
        String id,
        String name,
        String slug,
        String email,
        String phone,
        String address,
        String status,
        String plan,
        String createdAt
    ) {}

    public record TenantCreateRequest(
        String name,
        String slug,
        String email,
        String phone,
        String address,
        String plan
    ) {}

    public record TenantStatusRequest(String status) {}
}
