package com.att.events.producer;

import com.att.events.websocket.DashboardWebSocketHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class RealTimeDataProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final DashboardWebSocketHandler webSocketHandler;
    private final ObjectMapper objectMapper;
    private final Random random = new Random();

    private static final String[] STATES = {"TX", "CA", "FL", "NY", "GA", "IL", "PA", "OH", "NC", "WA", "AZ", "CO", "TN", "LA", "VA"};
    private static final String[] ACTIONS = {"New subscriber", "Plan upgrade", "Fiber activation", "Port-in from Verizon", "5G migration", "Business account", "Bundle activation"};
    private static final String[] SERVICES = {"AT&T Fiber", "AT&T 5G Premium", "AT&T Mobile Business", "AT&T FirstNet", "AT&T Entertainment"};

    @Scheduled(fixedRate = 2000)
    public void generateRealtimeActivity() {
        int activeSessions = webSocketHandler.getActiveSessionCount();
        if (activeSessions == 0) return;

        String eventId = UUID.randomUUID().toString();
        String state   = STATES[random.nextInt(STATES.length)];
        String action  = ACTIONS[random.nextInt(ACTIONS.length)];
        String service = SERVICES[random.nextInt(SERVICES.length)];

        // DATA DISCLOSURE: these events are randomly generated — NOT real AT&T subscriber transactions
        log.debug("[KAFKA-PRODUCE] [SIMULATED] topic=att.realtime.feed state={} action='{}' service='{}' sessions={} eventId={}",
            state, action, service, activeSessions, eventId);

        Map<String, Object> event = new HashMap<>();
        event.put("type", "LIVE_ACTIVITY");
        event.put("channel", "live_feed");
        event.put("id", eventId);
        event.put("state", state);
        event.put("action", action);
        event.put("service", service);
        event.put("value", String.format("$%.2f", 40 + random.nextDouble() * 120));
        event.put("timestamp", Instant.now().toString());
        event.put("simulated", true);  // explicit simulation flag on every event

        webSocketHandler.broadcastToAll(event);

        try {
            String payload = objectMapper.writeValueAsString(event);
            kafkaTemplate.send("att.realtime.feed", eventId, payload);
            log.debug("[KAFKA-PRODUCE] Published to att.realtime.feed key={}", eventId);
        } catch (Exception e) {
            log.error("[KAFKA-PRODUCE] Failed to publish to att.realtime.feed: {}", e.getMessage());
        }
    }

    @Scheduled(fixedRate = 30000)
    public void generateMarketShareUpdate() {
        String stateId = STATES[random.nextInt(STATES.length)];
        double attChange = (random.nextDouble() - 0.5) * 2;

        Map<String, Object> event = new HashMap<>();
        event.put("type", "MARKET_SHARE_UPDATE");
        event.put("channel", "state_updates");
        event.put("stateId", stateId);
        event.put("attShareDelta", String.format("%+.2f%%", attChange));
        event.put("timestamp", Instant.now().toString());

        webSocketHandler.broadcastToAll(event);
        log.debug("Generated market share update for state: {}", stateId);
    }
}
