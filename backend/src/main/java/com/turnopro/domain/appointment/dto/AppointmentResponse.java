package com.turnopro.domain.appointment.dto;

import com.turnopro.domain.appointment.entity.Appointment;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

public record AppointmentResponse(
    UUID id,
    UUID tenantId,
    UUID professionalId,
    String professionalName,
    UUID serviceId,
    String serviceName,
    String clientName,
    String clientEmail,
    String clientPhone,
    LocalDate appointmentDate,
    LocalTime startTime,
    LocalTime endTime,
    Appointment.AppointmentStatus status,
    String clientNotes,
    String internalNotes,
    String cancellationToken,
    LocalDateTime createdAt
) {}
