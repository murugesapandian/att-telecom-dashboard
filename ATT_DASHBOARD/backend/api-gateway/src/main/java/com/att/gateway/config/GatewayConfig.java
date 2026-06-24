package com.att.gateway.config;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
public class GatewayConfig extends AbstractGatewayFilterFactory<GatewayConfig.Config> {

    public GatewayConfig() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();

            // Pass-through for WebSocket and public endpoints
            String path = request.getPath().toString();
            if (path.startsWith("/ws") || path.startsWith("/actuator")) {
                return chain.filter(exchange);
            }

            // Add correlation ID header for tracing
            ServerHttpRequest modifiedRequest = exchange.getRequest().mutate()
                .header("X-Correlation-ID", java.util.UUID.randomUUID().toString())
                .header("X-Gateway-Source", "att-api-gateway")
                .build();

            return chain.filter(exchange.mutate().request(modifiedRequest).build());
        };
    }

    public static class Config {
        private List<String> publicPaths = List.of("/actuator", "/ws");
    }
}
