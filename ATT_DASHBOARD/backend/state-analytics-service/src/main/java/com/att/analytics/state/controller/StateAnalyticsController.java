package com.att.analytics.state.controller;

import com.att.analytics.state.model.StateData;
import com.att.analytics.state.service.StateAnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/states")
@RequiredArgsConstructor
@Tag(name = "State Analytics", description = "US State telecom market share analytics")
@CrossOrigin(origins = {"http://localhost:3000"})
public class StateAnalyticsController {

    private final StateAnalyticsService stateAnalyticsService;

    @GetMapping
    @Operation(summary = "Get all states market share data")
    public ResponseEntity<List<StateData>> getAllStates() {
        return ResponseEntity.ok(stateAnalyticsService.getAllStates());
    }

    @GetMapping("/{stateId}")
    @Operation(summary = "Get specific state market share")
    public ResponseEntity<StateData> getState(@PathVariable String stateId) {
        return stateAnalyticsService.getStateById(stateId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/region/{region}")
    @Operation(summary = "Get states by US region")
    public ResponseEntity<List<StateData>> getStatesByRegion(@PathVariable String region) {
        return ResponseEntity.ok(stateAnalyticsService.getStatesByRegion(region));
    }

    @GetMapping("/leader/{provider}")
    @Operation(summary = "Get states where specific provider leads")
    public ResponseEntity<List<StateData>> getStatesByLeader(@PathVariable String provider) {
        return ResponseEntity.ok(stateAnalyticsService.getStatesByLeader(provider));
    }

    @GetMapping("/opportunities")
    @Operation(summary = "Get high AT&T growth opportunity states")
    public ResponseEntity<List<StateData>> getOpportunityStates() {
        return ResponseEntity.ok(stateAnalyticsService.getHighOpportunityStates());
    }

    @GetMapping("/summary/national")
    @Operation(summary = "Get national market summary")
    public ResponseEntity<Map<String, Object>> getNationalSummary() {
        return ResponseEntity.ok(stateAnalyticsService.getNationalSummary());
    }

    @GetMapping("/top-att")
    @Operation(summary = "Get top AT&T performing states")
    public ResponseEntity<List<StateData>> getTopAttStates(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(stateAnalyticsService.getTopAttStates(limit));
    }

    @PutMapping("/{stateId}/share")
    @Operation(summary = "Update state provider market share")
    public ResponseEntity<StateData> updateShare(
            @PathVariable String stateId,
            @RequestBody Map<String, Double> shareUpdates) {
        return ResponseEntity.ok(stateAnalyticsService.updateStateShare(stateId, shareUpdates));
    }
}
