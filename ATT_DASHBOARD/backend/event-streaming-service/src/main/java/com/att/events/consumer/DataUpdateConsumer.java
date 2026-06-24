package com.att.events.consumer;

import com.att.events.websocket.DashboardWebSocketHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataUpdateConsumer {

    private final DashboardWebSocketHandler webSocketHandler;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "att.state.data.updates", groupId = "event-streaming-group")
    public void consumeStateUpdate(String message) {
        try {
            Map<String, Object> event = objectMapper.readValue(message, Map.class);
            event.put("channel", "state_updates");
            webSocketHandler.broadcastToAll(event);
            log.debug("Forwarded state update event via WebSocket");
        } catch (Exception e) {
            log.error("Error processing state update: {}", e.getMessage());
        }
    }

    @KafkaListener(topics = "att.provider.updates", groupId = "event-streaming-group")
    public void consumeProviderUpdate(String message) {
        try {
            Map<String, Object> event = objectMapper.readValue(message, Map.class);
            event.put("channel", "provider_updates");
            webSocketHandler.broadcastToAll(event);
        } catch (Exception e) {
            log.error("Error processing provider update: {}", e.getMessage());
        }
    }

    @KafkaListener(topics = "att.feedback.aggregated", groupId = "event-streaming-group")
    public void consumeFeedbackUpdate(String message) {
        try {
            Map<String, Object> event = objectMapper.readValue(message, Map.class);
            event.put("channel", "feedback_updates");
            webSocketHandler.broadcastToAll(event);
        } catch (Exception e) {
            log.error("Error processing feedback update: {}", e.getMessage());
        }
    }

    @KafkaListener(topics = "att.realtime.feed", groupId = "event-streaming-group")
    public void consumeRealtimeFeed(String message) {
        try {
            Map<String, Object> event = objectMapper.readValue(message, Map.class);
            event.put("channel", "live_feed");
            webSocketHandler.broadcastToAll(event);
        } catch (Exception e) {
            log.error("Error processing realtime feed: {}", e.getMessage());
        }
    }
}
