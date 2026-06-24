package com.att.plan.repository;

import com.att.plan.model.Plan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PlanRepository extends JpaRepository<Plan, Long> {
    List<Plan> findByProvider(String provider);
    List<Plan> findByPlanType(String planType);
    List<Plan> findByIsAttPlanTrue();
    List<Plan> findByMonthlyPriceLessThanEqual(Double maxPrice);
}
