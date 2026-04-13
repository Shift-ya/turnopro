package com.turnopro.domain.availability.service;

import com.turnopro.domain.appointment.entity.Appointment;
import com.turnopro.domain.appointment.repository.AppointmentRepository;
import com.turnopro.domain.availability.dto.AvailableSlotsResponse;
import com.turnopro.domain.availability.entity.Availability;
import com.turnopro.domain.availability.entity.AvailabilityBlock;
import com.turnopro.domain.availability.repository.AvailabilityBlockRepository;
import com.turnopro.domain.availability.repository.AvailabilityRepository;
import com.turnopro.domain.professional.entity.Professional;
import com.turnopro.domain.service.entity.Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Servicio de cálculo dinámico de slots disponibles.
 * 
 * Algoritmo:
 * 1. Obtener horario del profesional para el día solicitado
 * 2. Dividir en slots según duración del servicio
 * 3. Restar turnos ya reservados
 * 4. Restar bloqueos manuales
 * 5. Restar slots pasados (si es hoy)
 */
@org.springframework.stereotype.Service
@RequiredArgsConstructor
@Slf4j
public class SlotCalculatorService {

    private final AvailabilityRepository availabilityRepository;
    private final AvailabilityBlockRepository blockRepository;
    private final AppointmentRepository appointmentRepository;

    /**
     * Calcula los slots disponibles para un profesional, servicio y fecha.
     */
    public AvailableSlotsResponse calculateSlots(
            UUID tenantId,
            Professional professional,
            Service service,
            LocalDate date) {

        List<AvailableSlotsResponse.TimeSlot> slots = new ArrayList<>();

        // 1. Verificar que el profesional trabaja ese día de la semana
        Optional<Availability> availabilityOpt = availabilityRepository
            .findActiveByProfessionalAndDay(professional.getId(), date.getDayOfWeek());

        if (availabilityOpt.isEmpty()) {
            log.debug("Profesional {} no trabaja el {}", professional.getId(), date.getDayOfWeek());
            return buildResponse(professional, service, date, slots);
        }

        Availability availability = availabilityOpt.get();

        // 2. Obtener turnos existentes en esa fecha
        List<Appointment> existingAppointments = appointmentRepository
            .findByTenantIdAndProfessionalIdAndAppointmentDate(tenantId, professional.getId(), date);

        // 3. Obtener bloqueos manuales en esa fecha
        List<AvailabilityBlock> blocks = blockRepository
            .findByProfessionalIdAndBlockDate(professional.getId(), date);

        // Verificar si hay bloqueo de día completo
        boolean fullDayBlocked = blocks.stream().anyMatch(AvailabilityBlock::isFullDayBlock);
        if (fullDayBlocked) {
            log.debug("Profesional {} tiene bloqueo de día completo el {}", professional.getId(), date);
            return buildResponse(professional, service, date, slots);
        }

        // 4. Generar slots
        int durationMinutes = service.getDurationMinutes();
        LocalTime current = availability.getStartTime();
        LocalTime workEnd = availability.getEndTime();
        LocalTime now = LocalTime.now();
        boolean isToday = date.equals(LocalDate.now());

        while (!current.plusMinutes(durationMinutes).isAfter(workEnd)) {
            LocalTime slotEnd = current.plusMinutes(durationMinutes);

            boolean available = isSlotAvailable(current, slotEnd, existingAppointments, blocks, isToday, now);

            slots.add(new AvailableSlotsResponse.TimeSlot(current, slotEnd, available));
            current = current.plusMinutes(durationMinutes);
        }

        return buildResponse(professional, service, date, slots);
    }

    private boolean isSlotAvailable(
            LocalTime slotStart,
            LocalTime slotEnd,
            List<Appointment> appointments,
            List<AvailabilityBlock> blocks,
            boolean isToday,
            LocalTime now) {

        // Si es hoy y el slot ya pasó (con 30 min de margen), no disponible
        if (isToday && slotStart.isBefore(now.plusMinutes(30))) {
            return false;
        }

        // Verificar conflicto con turnos existentes
        boolean conflictsWithAppointment = appointments.stream()
            .filter(a -> a.getStatus() != Appointment.AppointmentStatus.CANCELLED)
            .anyMatch(a -> slotStart.isBefore(a.getEndTime()) && slotEnd.isAfter(a.getStartTime()));

        if (conflictsWithAppointment) return false;

        // Verificar conflicto con bloqueos parciales
        boolean conflictsWithBlock = blocks.stream()
            .filter(b -> !b.isFullDayBlock())
            .anyMatch(b -> b.conflictsWith(slotStart));

        return !conflictsWithBlock;
    }

    private AvailableSlotsResponse buildResponse(
            Professional professional,
            Service service,
            LocalDate date,
            List<AvailableSlotsResponse.TimeSlot> slots) {

        return new AvailableSlotsResponse(
            professional.getId(),
            professional.getFullName(),
            service.getId(),
            service.getName(),
            service.getDurationMinutes(),
            date,
            slots
        );
    }
}
