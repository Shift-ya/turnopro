package com.turnow.infrastructure.config;

import org.junit.jupiter.api.Test;
import org.springframework.boot.SpringApplication;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.env.StandardEnvironment;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class DatabaseUrlEnvironmentPostProcessorTest {

    @Test
    void convertsPostgresqlSchemeToJdbcAndExtractsCredentialsWhenMissing() {
        ConfigurableEnvironment env = new StandardEnvironment();
        env.getPropertySources().addFirst(new MapPropertySource("test", Map.of(
                "DATABASE_URL",
                "postgresql://postgres:secret@db.example.com:5432/postgres?sslmode=require"
        )));

        new DatabaseUrlEnvironmentPostProcessor().postProcessEnvironment(env, new SpringApplication(Object.class));

        assertEquals(
                "jdbc:postgresql://db.example.com:5432/postgres?sslmode=require",
                env.getProperty("DATABASE_URL")
        );
        assertEquals("postgres", env.getProperty("DATABASE_USER"));
        assertEquals("secret", env.getProperty("DATABASE_PASSWORD"));
    }

    @Test
    void doesNotTouchAlreadyJdbcUrl() {
        ConfigurableEnvironment env = new StandardEnvironment();
        env.getPropertySources().addFirst(new MapPropertySource("test", Map.of(
                "DATABASE_URL",
                "jdbc:postgresql://localhost:5432/turnow"
        )));

        new DatabaseUrlEnvironmentPostProcessor().postProcessEnvironment(env, new SpringApplication(Object.class));

        assertEquals("jdbc:postgresql://localhost:5432/turnow", env.getProperty("DATABASE_URL"));
        assertNull(env.getProperty("DATABASE_USER"));
        assertNull(env.getProperty("DATABASE_PASSWORD"));
    }

    @Test
    void doesNotOverrideExplicitUserAndPassword() {
        ConfigurableEnvironment env = new StandardEnvironment();
        env.getPropertySources().addFirst(new MapPropertySource("test", Map.of(
                "DATABASE_URL",
                "postgresql://postgres:secret@db.example.com:5432/postgres",
                "DATABASE_USER",
                "already",
                "DATABASE_PASSWORD",
                "set"
        )));

        new DatabaseUrlEnvironmentPostProcessor().postProcessEnvironment(env, new SpringApplication(Object.class));

        assertEquals("jdbc:postgresql://db.example.com:5432/postgres", env.getProperty("DATABASE_URL"));
        assertEquals("already", env.getProperty("DATABASE_USER"));
        assertEquals("set", env.getProperty("DATABASE_PASSWORD"));
    }
}
