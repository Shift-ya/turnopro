package com.turnow.domain.notification.service;

import com.turnow.domain.appointment.entity.Appointment;
import com.turnow.domain.professional.entity.Professional;
import com.turnow.domain.service.entity.Service;
import lombok.extern.slf4j.Slf4j;

@org.springframework.stereotype.Service
@Slf4j
public class NotificationService {

    public void sendConfirmation(Appointment appointment, Professional professional, Service service) {
        log.info(
            "Confirmacion pendiente para turno {} ({}) con profesional {} y servicio {}",
            appointment.getId(),
            appointment.getClientEmail(),
            professional.getFullName(),
            service.getName()
        );
    }

    public void sendCancellationNotification(Appointment appointment) {
        log.info(
            "Cancelacion pendiente para turno {} ({})",
            appointment.getId(),
            appointment.getClientEmail()
        );
    }
}
