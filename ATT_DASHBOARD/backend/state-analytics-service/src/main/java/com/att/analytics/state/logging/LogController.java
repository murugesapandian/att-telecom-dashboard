package com.att.analytics.state.logging;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Tag(name = "Application Logs", description = "Stores and queries frontend + backend log entries from SQLite")
@RestController
@RequestMapping("/logs")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class LogController {

    private final LogRepository logRepository;
    private final ObjectMapper objectMapper;

    @Operation(summary = "Ingest log entry", description = "Receives a single log entry from the frontend LoggingService and persists it to SQLite")
    @PostMapping
    public ResponseEntity<Map<String, Object>> ingestLog(@RequestBody Map<String, Object> payload) {
        try {
            LogEntry entry = LogEntry.builder()
                .level(str(payload, "level"))
                .category(str(payload, "category"))
                .action(str(payload, "action"))
                .data(payload.get("data") != null ? objectMapper.writeValueAsString(payload.get("data")) : null)
                .sessionId(str(payload, "sessionId"))
                .route(str(payload, "route"))
                .source("frontend")
                .timestamp(Instant.now())
                .build();

            logRepository.save(entry);
            log.debug("[FE-LOG] [{}] {}:{} session={}", entry.getLevel(), entry.getCategory(), entry.getAction(), entry.getSessionId());

            return ResponseEntity.ok(Map.of("status", "ok", "id", entry.getId()));
        } catch (JsonProcessingException e) {
            log.warn("Failed to parse frontend log payload", e);
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    @Operation(summary = "Query logs", description = "Returns recent log entries filtered by level, category, or source")
    @GetMapping
    public ResponseEntity<List<LogEntry>> getLogs(
        @RequestParam(defaultValue = "200") int limit,
        @RequestParam(required = false) String level,
        @RequestParam(required = false) String category,
        @RequestParam(required = false) String source
    ) {
        var pageable = PageRequest.of(0, Math.min(limit, 1000));
        List<LogEntry> logs;

        if (level != null)         logs = logRepository.findByLevelOrderByTimestampDesc(level, pageable);
        else if (category != null) logs = logRepository.findByCategoryOrderByTimestampDesc(category, pageable);
        else if (source != null)   logs = logRepository.findBySourceOrderByTimestampDesc(source, pageable);
        else                       logs = logRepository.findRecentLogs(pageable);

        return ResponseEntity.ok(logs);
    }

    @Operation(summary = "Log statistics", description = "Returns total count and breakdown by level and category")
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Long> byLevel = new HashMap<>();
        logRepository.countByLevel().forEach(row -> byLevel.put((String) row[0], (Long) row[1]));

        Map<String, Long> byCategory = new HashMap<>();
        logRepository.countByCategory().forEach(row -> byCategory.put((String) row[0], (Long) row[1]));

        return ResponseEntity.ok(Map.of(
            "total", logRepository.count(),
            "byLevel", byLevel,
            "byCategory", byCategory
        ));
    }

    @Operation(summary = "Clear all logs", description = "Deletes all log entries from SQLite")
    @DeleteMapping
    public ResponseEntity<Map<String, Object>> clearLogs() {
        long count = logRepository.count();
        logRepository.deleteAll();
        log.info("Cleared {} log entries via API", count);
        return ResponseEntity.ok(Map.of("deleted", count));
    }

    private String str(Map<String, Object> map, String key) {
        Object val = map.get(key);
        return val != null ? val.toString() : null;
    }
}
