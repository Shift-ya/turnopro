package com.turnow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import com.turnow.infrastructure.seed.DatabaseInitializer;

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
        app.addInitializers(new DatabaseInitializer());
        app.run(args);
    }
}
