package com.turnow.api;

import com.turnow.domain.auth.dto.LoginRequest;
import com.turnow.domain.user.entity.User;
import com.turnow.domain.user.repository.UserRepository;
import com.turnow.infrastructure.exception.BusinessException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.email().toLowerCase())
            .orElseThrow(() -> new BusinessException("Credenciales invalidas"));

        if (!user.getActive()) {
            throw new BusinessException("Usuario inactivo");
        }

        if (!request.password().equals(user.getPasswordHash())) {
            throw new BusinessException("Credenciales invalidas");
        }

        return ResponseEntity.ok(
            new LoginResponse(
                user.getId().toString(),
                user.getTenantId() == null ? null : user.getTenantId().toString(),
                user.getEmail(),
                user.getFullName(),
                user.getRole().name()
            )
        );
    }

    public record LoginResponse(
        String id,
        String tenantId,
        String email,
        String name,
        String role
    ) {}
}
