package com.turnow.domain.appointment.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public record CreateAppointmentRequest(

    @NotNull(message = "El ID del profesional es requerido")
    UUID professionalId,

    @NotNull(message = "El ID del servicio es requerido")
    UUID serviceId,

    @NotNull(message = "La fecha es requerida")
    @Future(message = "La fecha debe ser futura")
    LocalDate appointmentDate,

    @NotNull(message = "La hora de inicio es requerida")
    LocalTime startTime,

    @NotBlank(message = "El nombre del cliente es requerido")
    @Size(max = 200)
    String clientName,

    @NotBlank(message = "El email del cliente es requerido")
    @Email(message = "Formato de email inválido")
    String clientEmail,

    @Size(max = 50)
    String clientPhone,

    @Size(max = 500)
    String clientNotes
) {}
