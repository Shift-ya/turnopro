package com.turnow.infrastructure.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

public class DatabaseUrlEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    private static final String PROPERTY_SOURCE_NAME = "databaseUrlNormalizer";

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String databaseUrl = environment.getProperty("DATABASE_URL");
        if (databaseUrl == null || databaseUrl.isBlank()) {
            return;
        }

        String trimmed = databaseUrl.trim();
        if (trimmed.startsWith("jdbc:")) {
            return;
        }

        if (!(trimmed.startsWith("postgresql://") || trimmed.startsWith("postgres://"))) {
            return;
        }

        NormalizedDatabaseUrl normalized;
        try {
            normalized = normalize(trimmed);
        } catch (RuntimeException ex) {
            // If parsing fails, don't block startup; let Spring fail with the original error.
            return;
        }

        if (normalized.jdbcUrl == null || normalized.jdbcUrl.isBlank()) {
            return;
        }

        Map<String, Object> overrides = new HashMap<>();
        overrides.put("DATABASE_URL", normalized.jdbcUrl);

        if (environment.getProperty("DATABASE_USER") == null && normalized.username != null && !normalized.username.isBlank()) {
            overrides.put("DATABASE_USER", normalized.username);
        }

        if (environment.getProperty("DATABASE_PASSWORD") == null && normalized.password != null && !normalized.password.isBlank()) {
            overrides.put("DATABASE_PASSWORD", normalized.password);
        }

        environment.getPropertySources().addFirst(new MapPropertySource(PROPERTY_SOURCE_NAME, overrides));
    }

    @Override
    public int getOrder() {
        // Run early, before DataSource auto-configuration reads DATABASE_URL.
        return Ordered.HIGHEST_PRECEDENCE;
    }

    private static NormalizedDatabaseUrl normalize(String url) {
        URI uri = URI.create(url);

        String host = uri.getHost();
        int port = uri.getPort();
        String rawPath = uri.getRawPath();
        String rawQuery = uri.getRawQuery();

        // Defensive: some malformed URLs might parse without a host.
        if (host == null || host.isBlank()) {
            throw new IllegalArgumentException("DATABASE_URL does not contain a host");
        }

        StringBuilder jdbc = new StringBuilder("jdbc:postgresql://").append(host);
        if (port > 0) {
            jdbc.append(':').append(port);
        }

        if (rawPath != null && !rawPath.isBlank()) {
            jdbc.append(rawPath);
        }

        if (rawQuery != null && !rawQuery.isBlank()) {
            jdbc.append('?').append(rawQuery);
        }

        String username = null;
        String password = null;
        String userInfo = uri.getUserInfo();
        if (userInfo != null && !userInfo.isBlank()) {
            int colon = userInfo.indexOf(':');
            if (colon >= 0) {
                username = userInfo.substring(0, colon);
                password = userInfo.substring(colon + 1);
            } else {
                username = userInfo;
            }
        }

        return new NormalizedDatabaseUrl(jdbc.toString(), username, password);
    }

    private static final class NormalizedDatabaseUrl {
        private final String jdbcUrl;
        private final String username;
        private final String password;

        private NormalizedDatabaseUrl(String jdbcUrl, String username, String password) {
            this.jdbcUrl = jdbcUrl;
            this.username = username;
            this.password = password;
        }
    }
}
