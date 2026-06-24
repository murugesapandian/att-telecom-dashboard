package com.att.events.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
@Slf4j
public class DashboardWebSocketHandler extends TextWebSocketHandler {

    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        sessions.put(session.getId(), session);
        log.info("WebSocket client connected: {} (Total: {})", session.getId(), sessions.size());

        try {
            Map<String, Object> welcomeMsg = Map.of(
                "type", "CONNECTED",
                "message", "Connected to AT&T Real-Time Dashboard",
                "sessionId", session.getId(),
                "timestamp", System.currentTimeMillis()
            );
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(welcomeMsg)));
        } catch (IOException e) {
            log.error("Failed to send welcome message: {}", e.getMessage());
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(session.getId());
        log.info("WebSocket client disconnected: {} (Total: {})", session.getId(), sessions.size());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        log.debug("Received WS message from {}: {}", session.getId(), message.getPayload());
    }

    public void broadcastToAll(Object payload) {
        if (sessions.isEmpty()) return;
        try {
            String json = objectMapper.writeValueAsString(payload);
            TextMessage message = new TextMessage(json);
            sessions.values().forEach(session -> {
                if (session.isOpen()) {
                    try {
                        session.sendMessage(message);
                    } catch (IOException e) {
                        log.error("Failed to send message to session {}: {}", session.getId(), e.getMessage());
                        sessions.remove(session.getId());
                    }
                }
            });
        } catch (Exception e) {
            log.error("Failed to broadcast message: {}", e.getMessage());
        }
    }

    public int getActiveSessionCount() {
        return sessions.size();
    }
}
