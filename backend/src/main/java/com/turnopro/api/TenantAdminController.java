package com.turnopro.api;

import com.turnopro.domain.appointment.entity.Appointment;
import com.turnopro.domain.appointment.repository.AppointmentRepository;
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

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/admin/tenant")
@RequiredArgsConstructor
public class TenantAdminController {

    private final TenantRepository tenantRepository;
    private final TenantSettingsRepository tenantSettingsRepository;
    private final AppointmentRepository appointmentRepository;
    private final ProfessionalRepository professionalRepository;
    private final ServiceRepository serviceRepository;

    @GetMapping("/{tenantId}/overview")
    public ResponseEntity<TenantOverviewDto> getOverview(@PathVariable UUID tenantId) {
        Tenant tenant = getTenant(tenantId);

        List<Appointment> allAppointments = appointmentRepository.findByTenantId(tenantId, org.springframework.data.domain.Pageable.unpaged()).getContent();
        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.minusDays(6);

        long todayAppointments = allAppointments.stream().filter(a -> a.getAppointmentDate().equals(today)).count();
        long weekAppointments = allAppointments.stream().filter(a -> !a.getAppointmentDate().isBefore(weekStart) && !a.getAppointmentDate().isAfter(today)).count();

        long completed = allAppointments.stream().filter(a -> a.getStatus() == Appointment.AppointmentStatus.COMPLETED).count();
        long cancelled = allAppointments.stream().filter(a -> a.getStatus() == Appointment.AppointmentStatus.CANCELLED).count();
        long noShow = allAppointments.stream().filter(a -> a.getStatus() == Appointment.AppointmentStatus.NO_SHOW).count();
        long total = Math.max(allAppointments.size(), 1);

        double revenue = allAppointments.stream()
            .filter(a -> a.getStatus() == Appointment.AppointmentStatus.COMPLETED || a.getStatus() == Appointment.AppointmentStatus.BOOKED)
            .map(Appointment::getServiceId)
            .map(serviceRepository::findById)
            .flatMap(java.util.Optional::stream)
            .map(Service::getPrice)
            .filter(java.util.Objects::nonNull)
            .mapToDouble(BigDecimal::doubleValue)
            .sum();

        List<AppointmentDto> appointments = allAppointments.stream()
            .sorted((a, b) -> {
                int cmp = b.getAppointmentDate().compareTo(a.getAppointmentDate());
                return cmp != 0 ? cmp : b.getStartTime().compareTo(a.getStartTime());
            })
            .map(this::toAppointmentDto)
            .toList();

        return ResponseEntity.ok(
            new TenantOverviewDto(
                new TenantDto(tenant.getId().toString(), tenant.getBusinessName(), tenant.getSlug(), tenant.getEmail(), tenant.getPhone(), tenant.getAddress(), tenant.getStatus().name(), tenant.getPlan().name()),
                new TenantMetricsDto(
                    allAppointments.size(),
                    todayAppointments,
                    weekAppointments,
                    roundPct(completed, total),
                    roundPct(cancelled, total),
                    roundPct(noShow, total),
                    revenue,
                    0
                ),
                appointments,
                professionalRepository.findByTenantId(tenantId).stream().map(this::toProfessionalDto).toList(),
                serviceRepository.findAll().stream().filter(s -> s.getTenantId().equals(tenantId)).map(this::toServiceDto).toList()
            )
        );
    }

    @GetMapping("/{tenantId}/appointments")
    public ResponseEntity<List<AppointmentDto>> getAppointments(
        @PathVariable UUID tenantId,
        @RequestParam(required = false) LocalDate date
    ) {
        List<Appointment> appointments = date == null
            ? appointmentRepository.findByTenantId(tenantId, org.springframework.data.domain.Pageable.unpaged()).getContent()
            : appointmentRepository.findByTenantIdAndAppointmentDate(tenantId, date);

        return ResponseEntity.ok(appointments.stream().map(this::toAppointmentDto).toList());
    }

    @GetMapping("/{tenantId}/professionals")
    public ResponseEntity<List<ProfessionalDto>> getProfessionals(@PathVariable UUID tenantId) {
        return ResponseEntity.ok(professionalRepository.findByTenantId(tenantId).stream().map(this::toProfessionalDto).toList());
    }

    @PostMapping("/{tenantId}/professionals")
    public ResponseEntity<ProfessionalDto> createProfessional(@PathVariable UUID tenantId, @RequestBody ProfessionalUpsertRequest request) {
        Professional professional = Professional.builder()
            .tenantId(tenantId)
            .firstName(request.firstName())
            .lastName(request.lastName())
            .email(request.email())
            .phone(request.phone())
            .bio(request.speciality())
            .active(true)
            .build();
        return ResponseEntity.ok(toProfessionalDto(professionalRepository.save(professional)));
    }

    @PutMapping("/{tenantId}/professionals/{professionalId}")
    public ResponseEntity<ProfessionalDto> updateProfessional(
        @PathVariable UUID tenantId,
        @PathVariable UUID professionalId,
        @RequestBody ProfessionalUpsertRequest request
    ) {
        Professional professional = professionalRepository.findByIdAndTenantId(professionalId, tenantId)
            .orElseThrow(() -> new ResourceNotFoundException("Profesional no encontrado"));
        professional.setFirstName(request.firstName());
        professional.setLastName(request.lastName());
        professional.setEmail(request.email());
        professional.setPhone(request.phone());
        professional.setBio(request.speciality());
        professional.setActive(request.active());
        return ResponseEntity.ok(toProfessionalDto(professionalRepository.save(professional)));
    }

    @DeleteMapping("/{tenantId}/professionals/{professionalId}")
    public ResponseEntity<Void> deactivateProfessional(@PathVariable UUID tenantId, @PathVariable UUID professionalId) {
        Professional professional = professionalRepository.findByIdAndTenantId(professionalId, tenantId)
            .orElseThrow(() -> new ResourceNotFoundException("Profesional no encontrado"));
        professional.setActive(false);
        professionalRepository.save(professional);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{tenantId}/services")
    public ResponseEntity<List<ServiceDto>> getServices(@PathVariable UUID tenantId) {
        return ResponseEntity.ok(serviceRepository.findAll().stream().filter(s -> s.getTenantId().equals(tenantId)).map(this::toServiceDto).toList());
    }

    @PostMapping("/{tenantId}/services")
    public ResponseEntity<ServiceDto> createService(@PathVariable UUID tenantId, @RequestBody ServiceUpsertRequest request) {
        Service service = Service.builder()
            .tenantId(tenantId)
            .name(request.name())
            .description(request.description())
            .durationMinutes(request.duration())
            .price(BigDecimal.valueOf(request.price()))
            .active(true)
            .build();
        return ResponseEntity.ok(toServiceDto(serviceRepository.save(service)));
    }

    @PutMapping("/{tenantId}/services/{serviceId}")
    public ResponseEntity<ServiceDto> updateService(
        @PathVariable UUID tenantId,
        @PathVariable UUID serviceId,
        @RequestBody ServiceUpsertRequest request
    ) {
        Service service = serviceRepository.findByIdAndTenantId(serviceId, tenantId)
            .orElseThrow(() -> new ResourceNotFoundException("Servicio no encontrado"));
        service.setName(request.name());
        service.setDescription(request.description());
        service.setDurationMinutes(request.duration());
        service.setPrice(BigDecimal.valueOf(request.price()));
        service.setActive(request.active());
        return ResponseEntity.ok(toServiceDto(serviceRepository.save(service)));
    }

    @DeleteMapping("/{tenantId}/services/{serviceId}")
    public ResponseEntity<Void> deleteService(@PathVariable UUID tenantId, @PathVariable UUID serviceId) {
        Service service = serviceRepository.findByIdAndTenantId(serviceId, tenantId)
            .orElseThrow(() -> new ResourceNotFoundException("Servicio no encontrado"));
        serviceRepository.delete(service);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{tenantId}/settings")
    public ResponseEntity<TenantDto> updateSettings(@PathVariable UUID tenantId, @RequestBody TenantSettingsRequest request) {
        Tenant tenant = getTenant(tenantId);
        tenant.setBusinessName(request.businessName());
        tenant.setEmail(request.email());
        tenant.setPhone(request.phone());
        tenant.setAddress(request.address());
        tenant.setSlug(request.slug());
        tenantRepository.save(tenant);

        TenantSettings settings = tenantSettingsRepository.findById(tenantId).orElse(
            TenantSettings.builder().tenantId(tenantId).tenant(tenant).build()
        );
        settings.setPrimaryColor(request.primaryColor());
        tenantSettingsRepository.save(settings);

        return ResponseEntity.ok(new TenantDto(
            tenant.getId().toString(),
            tenant.getBusinessName(),
            tenant.getSlug(),
            tenant.getEmail(),
            tenant.getPhone(),
            tenant.getAddress(),
            tenant.getStatus().name(),
            tenant.getPlan().name()
        ));
    }

    private Tenant getTenant(UUID tenantId) {
        return tenantRepository.findById(tenantId)
            .orElseThrow(() -> new ResourceNotFoundException("Tenant no encontrado"));
    }

    private double roundPct(long value, long total) {
        return Math.round(((double) value * 10000.0) / total) / 100.0;
    }

    private AppointmentDto toAppointmentDto(Appointment a) {
        return new AppointmentDto(
            a.getId().toString(),
            a.getTenantId().toString(),
            a.getServiceId().toString(),
            a.getProfessionalId().toString(),
            a.getClientName(),
            a.getClientEmail(),
            a.getClientPhone(),
            a.getAppointmentDate().toString(),
            a.getStartTime().toString(),
            a.getEndTime().toString(),
            a.getStatus().name(),
            a.getClientNotes(),
            a.getCreatedAt() == null ? null : a.getCreatedAt().toString()
        );
    }

    private ProfessionalDto toProfessionalDto(Professional p) {
        return new ProfessionalDto(
            p.getId().toString(),
            p.getTenantId().toString(),
            p.getFullName(),
            p.getEmail(),
            p.getPhone(),
            p.getBio(),
            p.getActive()
        );
    }

    private ServiceDto toServiceDto(Service s) {
        return new ServiceDto(
            s.getId().toString(),
            s.getTenantId().toString(),
            s.getName(),
            s.getDescription(),
            s.getDurationMinutes(),
            s.getPrice() == null ? 0 : s.getPrice().doubleValue(),
            "ARS",
            s.getActive(),
            "General"
        );
    }

    public record TenantOverviewDto(
        TenantDto tenant,
        TenantMetricsDto metrics,
        List<AppointmentDto> appointments,
        List<ProfessionalDto> professionals,
        List<ServiceDto> services
    ) {}

    public record TenantDto(
        String id,
        String name,
        String slug,
        String email,
        String phone,
        String address,
        String status,
        String plan
    ) {}

    public record TenantMetricsDto(
        long totalAppointments,
        long todayAppointments,
        long weekAppointments,
        double completedRate,
        double cancelledRate,
        double noShowRate,
        double revenue,
        long newClients
    ) {}

    public record AppointmentDto(
        String id,
        String tenantId,
        String serviceId,
        String professionalId,
        String clientName,
        String clientEmail,
        String clientPhone,
        String date,
        String startTime,
        String endTime,
        String status,
        String notes,
        String createdAt
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

    public record ProfessionalUpsertRequest(
        String firstName,
        String lastName,
        String email,
        String phone,
        String speciality,
        boolean active
    ) {}

    public record ServiceUpsertRequest(
        String name,
        String description,
        int duration,
        double price,
        boolean active
    ) {}

    public record TenantSettingsRequest(
        String businessName,
        String email,
        String phone,
        String address,
        String slug,
        String primaryColor
    ) {}
}
