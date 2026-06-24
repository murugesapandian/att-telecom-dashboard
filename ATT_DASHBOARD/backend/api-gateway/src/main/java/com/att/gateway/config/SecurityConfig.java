package com.att.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
            .csrf(ServerHttpSecurity.CsrfSpec::disable)
            .authorizeExchange(ex -> ex
                // Swagger / OpenAPI
                .pathMatchers(
                    "/swagger-ui.html",
                    "/swagger-ui/**",
                    "/webjars/**",
                    "/v3/api-docs/**",
                    "/v3/api-docs"
                ).permitAll()
                // Gateway own endpoints
                .pathMatchers("/actuator/**").permitAll()
                // All proxied API traffic — let downstream services handle auth
                .pathMatchers("/api/**", "/ws/**").permitAll()
                .anyExchange().permitAll()
            )
            .build();
    }
}
