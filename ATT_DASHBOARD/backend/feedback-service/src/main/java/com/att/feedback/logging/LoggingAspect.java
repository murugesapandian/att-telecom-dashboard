package com.att.feedback.logging;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class LoggingAspect {

    @Around("execution(* com.att.feedback.service..*(..))")
    public Object logServiceCall(ProceedingJoinPoint jp) throws Throwable {
        String className  = jp.getTarget().getClass().getSimpleName();
        String methodName = jp.getSignature().getName();
        long start = System.currentTimeMillis();

        log.info("[SERVICE] {}.{}() — START", className, methodName);
        try {
            Object result = jp.proceed();
            log.info("[SERVICE] {}.{}() — OK  {}ms", className, methodName, System.currentTimeMillis() - start);
            return result;
        } catch (Throwable ex) {
            log.error("[SERVICE] {}.{}() — ERROR {}ms — {}",
                className, methodName, System.currentTimeMillis() - start, ex.getMessage(), ex);
            throw ex;
        }
    }
}
