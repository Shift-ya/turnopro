package com.turnopro.api;

import com.turnopro.domain.appointment.dto.AppointmentResponse;
import com.turnopro.domain.appointment.dto.CreateAppointmentRequest;
import com.turnopro.domain.appointment.service.AppointmentService;
import com.turnopro.domain.availability.dto.AvailableSlotsResponse;
import com.turnopro.domain.availability.service.SlotCalculatorService;
import com.turnopro.domain.professional.entity.Professional;
import com.turnopro.domain.professional.repository.ProfessionalRepository;
import com.turnopro.domain.service.entity.Service;
import com.turnopro.domain.service.repository.ServiceRepository;
import com.turnopro.domain.tenant.entity.Tenant;
import com.turnopro.domain.tenant.entity.TenantSettings;
import com.turnopro.domain.tenant.repository.TenantRepository;
import com.turnopro.domain.tenant.repository.TenantSettingsRepository;
import com.turnopro.infrastructure.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/public")
@RequiredArgsConstructor
public class PublicBookingController {

    private final TenantRepository tenantRepository;
    private final TenantSettingsRepository tenantSettingsRepository;
    private final ServiceRepository serviceRepository;
    private final ProfessionalRepository professionalRepository;
    private final SlotCalculatorService slotCalculatorService;
    private final AppointmentService appointmentService;

    @GetMapping("/tenant/{slug}")
    public ResponseEntity<TenantPublicDto> getTenantBySlug(@PathVariable String slug) {
        Tenant tenant = tenantRepository.findBySlug(slug)
            .orElseThrow(() -> new ResourceNotFoundException("Tenant no encontrado"));

        TenantSettings settings = tenantSettingsRepository.findById(tenant.getId()).orElse(null);

        return ResponseEntity.ok(
            new TenantPublicDto(
                tenant.getId().toString(),
                tenant.getSlug(),
                tenant.getBusinessName(),
                tenant.getEmail(),
                tenant.getPhone(),
                tenant.getAddress(),
                tenant.getStatus().name(),
                tenant.getPlan().name(),
                settings == null ? "#6366f1" : settings.getPrimaryColor(),
                settings == null ? "#8b5cf6" : settings.getSecondaryColor()
            )
        );
    }

    @GetMapping("/tenant/{slug}/services")
    public ResponseEntity<List<ServiceDto>> getServices(@PathVariable String slug) {
        Tenant tenant = getTenant(slug);
        List<ServiceDto> services = serviceRepository.findByTenantIdAndActiveTrue(tenant.getId())
            .stream()
            .map(s -> new ServiceDto(
                s.getId().toString(),
                s.getTenantId().toString(),
                s.getName(),
                s.getDescription(),
                s.getDurationMinutes(),
                s.getPrice() == null ? 0 : s.getPrice().doubleValue(),
                "ARS",
                s.getActive(),
                "General"
            ))
            .toList();
        return ResponseEntity.ok(services);
    }

    @GetMapping("/tenant/{slug}/professionals")
    public ResponseEntity<List<ProfessionalDto>> getProfessionals(
        @PathVariable String slug,
        @RequestParam(required = false) UUID serviceId
    ) {
        Tenant tenant = getTenant(slug);
        List<Professional> professionals = serviceId == null
            ? professionalRepository.findByTenantIdAndActiveTrue(tenant.getId())
            : professionalRepository.findByTenantIdAndServiceId(tenant.getId(), serviceId);

        return ResponseEntity.ok(
            professionals.stream()
                .map(p -> new ProfessionalDto(
                    p.getId().toString(),
                    p.getTenantId().toString(),
                    p.getFullName(),
                    p.getEmail(),
                    p.getPhone(),
                    p.getBio(),
                    p.getActive()
                ))
                .toList()
        );
    }

    @GetMapping("/tenant/{slug}/slots")
    public ResponseEntity<AvailableSlotsResponse> getSlots(
        @PathVariable String slug,
        @RequestParam UUID professionalId,
        @RequestParam UUID serviceId,
        @RequestParam LocalDate date
    ) {
        Tenant tenant = getTenant(slug);
        Professional professional = professionalRepository.findByIdAndTenantId(professionalId, tenant.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Profesional no encontrado"));
        Service service = serviceRepository.findByIdAndTenantId(serviceId, tenant.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Servicio no encontrado"));

        return ResponseEntity.ok(
            slotCalculatorService.calculateSlots(tenant.getId(), professional, service, date)
        );
    }

    @PostMapping("/tenant/{slug}/appointments")
    public ResponseEntity<AppointmentResponse> createAppointment(
        @PathVariable String slug,
        @RequestBody CreateAppointmentRequest request
    ) {
        Tenant tenant = getTenant(slug);
        AppointmentResponse created = appointmentService.createAppointment(tenant.getId(), request);
        return ResponseEntity.ok(created);
    }

    @PostMapping("/appointments/cancel/{token}")
    public ResponseEntity<Void> cancelByToken(@PathVariable String token) {
        appointmentService.cancelByToken(token);
        return ResponseEntity.noContent().build();
    }

    private Tenant getTenant(String slug) {
        return tenantRepository.findBySlug(slug)
            .orElseThrow(() -> new ResourceNotFoundException("Tenant no encontrado"));
    }

    public record TenantPublicDto(
        String id,
        String slug,
        String businessName,
        String email,
        String phone,
        String address,
        String status,
        String plan,
        String primaryColor,
        String secondaryColor
    ) {}

    public record ServiceDto(
        String id,
        String tenantId,
        String name,
        String description,
        int duration,
        double price,
        String currency,
        boolean active,
        String category
    ) {}

    public record ProfessionalDto(
        String id,
        String tenantId,
        String name,
        String email,
        String phone,
        String speciality,
        boolean active
    ) {}
}
