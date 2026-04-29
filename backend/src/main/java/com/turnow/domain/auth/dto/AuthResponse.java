package com.turnow.domain.auth.dto;

import com.turnow.domain.user.entity.User;

import java.util.UUID;

public record AuthResponse(
    String accessToken,
    String tokenType,
    Long expiresIn,
    UUID userId,
    UUID tenantId,
    String email,
    String fullName,
    User.Role role
) {
    public static AuthResponse of(String token, Long expiresIn, User user) {
        return new AuthResponse(
            token,
            "Bearer",
            expiresIn,
            user.getId(),
            user.getTenantId(),
            user.getEmail(),
            user.getFullName(),
            user.getRole()
        );
    }
}
