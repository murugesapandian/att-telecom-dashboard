package com.att.analytics.state.kafka;

import com.att.analytics.state.model.StateData;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class StateDataEventPublisher {

    private static final String TOPIC = "att.state.data.updates";

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public void publishStateUpdate(StateData state) {
        try {
            Map<String, Object> event = new HashMap<>();
            event.put("eventType", "STATE_SHARE_UPDATED");
            event.put("stateId", state.getStateId());
            event.put("stateName", state.getStateName());
            event.put("attShare", state.getAttShare());
            event.put("marketLeader", state.getMarketLeader());
            event.put("timestamp", Instant.now().toString());

            String payload = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(TOPIC, state.getStateId(), payload);
            log.debug("Published state update event for: {}", state.getStateId());
        } catch (JsonProcessingException e) {
            log.error("Failed to publish state update event for {}: {}", state.getStateId(), e.getMessage());
        }
    }

    public void publishRealTimeFeedEvent(String stateId, String action, String service, double value) {
        try {
            Map<String, Object> event = new HashMap<>();
            event.put("eventType", "REALTIME_ACTIVITY");
            event.put("stateId", stateId);
            event.put("action", action);
            event.put("service", service);
            event.put("value", value);
            event.put("timestamp", Instant.now().toString());

            String payload = objectMapper.writeValueAsString(event);
            kafkaTemplate.send("att.realtime.feed", stateId, payload);
        } catch (JsonProcessingException e) {
            log.error("Failed to publish real-time feed event: {}", e.getMessage());
        }
    }
}
