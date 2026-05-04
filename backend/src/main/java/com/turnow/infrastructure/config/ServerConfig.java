package com.turnow.infrastructure.config;

import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Ensures server properties are correctly read from application.yml
 */
@Configuration
@EnableConfigurationProperties(ServerProperties.class)
public class ServerConfig {
}
