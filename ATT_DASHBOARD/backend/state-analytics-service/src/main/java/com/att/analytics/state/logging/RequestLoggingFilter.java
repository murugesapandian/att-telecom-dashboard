package com.att.analytics.state.logging;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Logs every inbound HTTP request and its response status + duration.
 * Applied to all requests once per request (OncePerRequestFilter guarantee).
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class RequestLoggingFilter extends OncePerRequestFilter {

    private final LogRepository logRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        long start = System.currentTimeMillis();
        String method = request.getMethod();
        String uri    = request.getRequestURI();
        String query  = request.getQueryString();

        try {
            chain.doFilter(request, response);
        } finally {
            long elapsed = System.currentTimeMillis() - start;
            int status   = response.getStatus();

            String fullPath = query != null ? uri + "?" + query : uri;
            String level    = status >= 500 ? "ERROR" : status >= 400 ? "WARN" : "INFO";

            log.info("[HTTP] {} {} {} {}ms", method, fullPath, status, elapsed);

            // Persist to DB — skip logging calls themselves to avoid recursion
            if (!uri.contains("/logs")) {
                try {
                    LogEntry entry = LogEntry.builder()
                        .level(level)
                        .category("HTTP")
                        .action(method + " " + uri)
                        .data("status=" + status)
                        .source("backend")
                        .serviceName("state-analytics-service")
                        .durationMs(elapsed)
                        .build();
                    logRepository.save(entry);
                } catch (Exception e) {
                    log.warn("Failed to persist HTTP log: {}", e.getMessage());
                }
            }
        }
    }
}
