package com.att.plan.controller;

import com.att.plan.model.Plan;
import com.att.plan.service.PlanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/plans")
@RequiredArgsConstructor
@Tag(name = "Plan Comparison", description = "Telecom plan comparison endpoints")
@CrossOrigin(origins = {"http://localhost:3000"})
public class PlanController {
    private final PlanService planService;

    @GetMapping public ResponseEntity<List<Plan>> getAllPlans() { return ResponseEntity.ok(planService.getAllPlans()); }
    @GetMapping("/wireless") public ResponseEntity<List<Plan>> getWirelessPlans() { return ResponseEntity.ok(planService.getPlansByType("wireless")); }
    @GetMapping("/broadband") public ResponseEntity<List<Plan>> getBroadbandPlans() { return ResponseEntity.ok(planService.getPlansByType("broadband")); }
    @GetMapping("/provider/{provider}") public ResponseEntity<List<Plan>> getByProvider(@PathVariable String provider) { return ResponseEntity.ok(planService.getPlansByProvider(provider)); }
    @GetMapping("/compare") public ResponseEntity<Map<String, Object>> comparePlans(@RequestParam List<Long> planIds) { return ResponseEntity.ok(planService.comparePlans(planIds)); }
    @GetMapping("/att/competitive-analysis") public ResponseEntity<Map<String, Object>> getAttCompetitiveAnalysis() { return ResponseEntity.ok(planService.getAttCompetitiveAnalysis()); }
}
