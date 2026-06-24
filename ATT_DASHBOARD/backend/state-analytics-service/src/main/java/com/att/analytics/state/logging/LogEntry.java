package com.att.analytics.state.logging;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "app_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LogEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String level;           // DEBUG, INFO, WARN, ERROR

    @Column(nullable = false)
    private String category;        // NAVIGATION, USER_ACTION, CHART, MAP, API_CALL, ...

    @Column(nullable = false)
    private String action;

    @Column(columnDefinition = "TEXT")
    private String data;            // JSON payload from frontend

    @Column
    private String sessionId;

    @Column
    private String route;           // Browser route at time of log

    @Column
    private String source;          // "frontend" or "backend"

    @Column
    private String serviceName;     // Backend service name (null for frontend logs)

    @Column
    private Long durationMs;        // For performance logs

    @Builder.Default
    @Column(nullable = false)
    private Instant timestamp = Instant.now();
}
