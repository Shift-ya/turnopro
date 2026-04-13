package com.turnopro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * TurnoPro - SaaS de Gestión de Turnos Multi-Tenant
 *
 * Arquitectura: Monolito Modular con DDD simplificado
 * Stack: Spring Boot 3 + PostgreSQL + JWT + Flyway
 */
@SpringBootApplication
@EnableAsync
@EnableScheduling
public class TurnoproApplication {

    public static void main(String[] args) {
        SpringApplication.run(TurnoproApplication.class, args);
    }
}
