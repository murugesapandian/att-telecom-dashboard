package com.att.analytics.state.logging;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

/**
 * AOP aspect that logs every @Service method call: class, method, args summary,
 * execution time, and success/failure outcome. Writes to SLF4J which feeds
 * into logback-spring.xml (structured JSON in production, readable text in dev).
 */
@Aspect
@Component
@Slf4j
@RequiredArgsConstructor
public class LoggingAspect {

    private final LogRepository logRepository;

    @Around("execution(* com.att.analytics.state.service..*(..))")
    public Object logServiceCall(ProceedingJoinPoint jp) throws Throwable {
        String className  = jp.getTarget().getClass().getSimpleName();
        String methodName = jp.getSignature().getName();
        long start = System.currentTimeMillis();

        log.info("[SERVICE] {}.{}() — START", className, methodName);

        try {
            Object result = jp.proceed();
            long elapsed = System.currentTimeMillis() - start;
            log.info("[SERVICE] {}.{}() — OK  {}ms", className, methodName, elapsed);

            persistBackendLog("INFO", "SERVICE", className + "." + methodName, elapsed, null);
            return result;

        } catch (Throwable ex) {
            long elapsed = System.currentTimeMillis() - start;
            log.error("[SERVICE] {}.{}() — ERROR {}ms — {}", className, methodName, elapsed, ex.getMessage(), ex);

            persistBackendLog("ERROR", "SERVICE", className + "." + methodName, elapsed, ex.getMessage());
            throw ex;
        }
    }

    @Around("execution(* com.att.analytics.state.kafka..*(..))")
    public Object logKafkaCall(ProceedingJoinPoint jp) throws Throwable {
        String className  = jp.getTarget().getClass().getSimpleName();
        String methodName = jp.getSignature().getName();
        long start = System.currentTimeMillis();

        try {
            Object result = jp.proceed();
            long elapsed = System.currentTimeMillis() - start;
            log.info("[KAFKA] {}.{}() — published  {}ms", className, methodName, elapsed);
            persistBackendLog("INFO", "KAFKA", className + "." + methodName, elapsed, null);
            return result;

        } catch (Throwable ex) {
            log.error("[KAFKA] {}.{}() — FAILED — {}", className, methodName, ex.getMessage(), ex);
            persistBackendLog("ERROR", "KAFKA", className + "." + methodName,
                System.currentTimeMillis() - start, ex.getMessage());
            throw ex;
        }
    }

    private void persistBackendLog(String level, String category, String action, long durationMs, String errorMsg) {
        try {
            LogEntry entry = LogEntry.builder()
                .level(level)
                .category(category)
                .action(action)
                .data(errorMsg)
                .source("backend")
                .serviceName("state-analytics-service")
                .durationMs(durationMs)
                .build();
            logRepository.save(entry);
        } catch (Exception e) {
            // DB logging must never kill the main flow
            log.warn("Failed to persist backend log entry: {}", e.getMessage());
        }
    }
}
