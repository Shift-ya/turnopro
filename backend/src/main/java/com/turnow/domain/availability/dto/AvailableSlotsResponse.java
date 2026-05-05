package com.turnow.domain.availability.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public record AvailableSlotsResponse(
    UUID professionalId,
    String professionalName,
    UUID serviceId,
    String serviceName,
    int durationMinutes,
    LocalDate date,
    List<TimeSlot> slots
) {
    public record TimeSlot(
        LocalTime startTime,
        LocalTime endTime,
        boolean available
    ) {}
}
