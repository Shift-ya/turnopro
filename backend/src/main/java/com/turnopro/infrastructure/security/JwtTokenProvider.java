package com.turnopro.infrastructure.security;

import com.turnopro.domain.user.entity.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Componente para generación y validación de JWT.
 * 
 * Claims incluidos en el token:
 * - sub: email del usuario
 * - userId: UUID del usuario
 * - tenantId: UUID del tenant (null para SUPER_ADMIN)
 * - role: rol del usuario
 */
@Component
@Slf4j
public class JwtTokenProvider {

    private final SecretKey signingKey;
    private final long jwtExpiration;

    public JwtTokenProvider(
            @Value("${app.jwt.secret}") String jwtSecret,
            @Value("${app.jwt.expiration}") long jwtExpiration) {
        this.signingKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        this.jwtExpiration = jwtExpiration;
    }

    /**
     * Genera un JWT para el usuario autenticado.
     */
    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId().toString());
        claims.put("role", user.getRole().name());

        if (user.getTenantId() != null) {
            claims.put("tenantId", user.getTenantId().toString());
        }

        return Jwts.builder()
            .claims(claims)
            .subject(user.getEmail())
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
            .signWith(signingKey)
            .compact();
    }

    /**
     * Extrae el email del subject del token.
     */
    public String extractEmail(String token) {
        return parseClaims(token).getSubject();
    }

    /**
     * Extrae el userId del token.
     */
    public UUID extractUserId(String token) {
        String userId = (String) parseClaims(token).get("userId");
        return UUID.fromString(userId);
    }

    /**
     * Extrae el tenantId del token (puede ser null para SUPER_ADMIN).
     */
    public UUID extractTenantId(String token) {
        String tenantId = (String) parseClaims(token).get("tenantId");
        return tenantId != null ? UUID.fromString(tenantId) : null;
    }

    /**
     * Extrae el rol del token.
     */
    public User.Role extractRole(String token) {
        String role = (String) parseClaims(token).get("role");
        return User.Role.valueOf(role);
    }

    /**
     * Valida el token: firma, expiración y estructura.
     */
    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.warn("JWT expirado: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.warn("JWT no soportado: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.warn("JWT malformado: {}", e.getMessage());
        } catch (SecurityException e) {
            log.warn("Firma JWT inválida: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.warn("JWT vacío: {}", e.getMessage());
        }
        return false;
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
            .verifyWith(signingKey)
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }
}
