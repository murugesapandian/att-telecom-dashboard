package com.att.plan.service;

import com.att.plan.model.Plan;
import com.att.plan.repository.PlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PlanService {
    private final PlanRepository planRepository;

    public List<Plan> getAllPlans() { return planRepository.findAll(); }
    public List<Plan> getPlansByType(String type) { return planRepository.findByPlanType(type); }
    public List<Plan> getPlansByProvider(String provider) { return planRepository.findByProvider(provider); }

    public Map<String, Object> comparePlans(List<Long> planIds) {
        List<Plan> plans = planRepository.findAllById(planIds);
        Map<String, Object> comparison = new HashMap<>();
        comparison.put("plans", plans);
        comparison.put("lowestPrice", plans.stream().mapToDouble(Plan::getMonthlyPrice).min().orElse(0));
        comparison.put("highestPrice", plans.stream().mapToDouble(Plan::getMonthlyPrice).max().orElse(0));
        return comparison;
    }

    public Map<String, Object> getAttCompetitiveAnalysis() {
        List<Plan> attPlans = planRepository.findByProvider("AT&T");
        List<Plan> allPlans = planRepository.findAll();
        Map<String, Object> analysis = new HashMap<>();
        analysis.put("attPlans", attPlans);
        analysis.put("avgAttPrice", attPlans.stream().mapToDouble(Plan::getMonthlyPrice).average().orElse(0));
        analysis.put("avgMarketPrice", allPlans.stream().mapToDouble(Plan::getMonthlyPrice).average().orElse(0));
        return analysis;
    }
}
