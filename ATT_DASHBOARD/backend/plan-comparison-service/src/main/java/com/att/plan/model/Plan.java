package com.att.plan.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "plans")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Plan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String provider;
    private String planName;
    private String planType; // wireless, broadband
    private Double monthlyPrice;
    private String dataAllowance;
    private String hotspotData;
    private String streamingQuality;
    private String networkType;
    private String internationalFeatures;
    private Boolean isRecommended;
    private String badge;
    private String perks;
    private Boolean isAttPlan;
}
