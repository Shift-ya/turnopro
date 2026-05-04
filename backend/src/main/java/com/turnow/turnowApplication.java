package com.turnow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * turnow - SaaS de Gestión de Turnos Multi-Tenant
 *
 * Arquitectura: Monolito Modular con DDD simplificado
 * Stack: Spring Boot 3 + PostgreSQL + JWT + Flyway
 */
@SpringBootApplication
@EnableAsync
@EnableScheduling
public class turnowApplication {

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(turnowApplication.class);
        app.setWebApplicationType(WebApplicationType.SERVLET);
        app.run(args);
    }

    @EventListener(ApplicationReadyEvent.class)
    void onReady() {
        String port = System.getProperty("server.port", "8080");
        String address = System.getProperty("server.address", "127.0.0.1");
        System.out.println("===== SERVER CONFIGURATION =====");
        System.out.println("Server listening on: " + address + ":" + port);
        System.out.println("===============================");
    }
}
