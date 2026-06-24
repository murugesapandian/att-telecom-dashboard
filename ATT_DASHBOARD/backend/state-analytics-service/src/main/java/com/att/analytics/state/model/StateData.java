package com.att.analytics.state.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "state_data")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StateData {

    @Id
    @Column(name = "state_id", length = 2)
    private String stateId;

    @Column(nullable = false)
    private String stateName;

    private String region;
    private Long population;

    @Column(name = "att_share")
    private Double attShare;

    @Column(name = "verizon_share")
    private Double verizonShare;

    @Column(name = "tmobile_share")
    private Double tmobileShare;

    @Column(name = "comcast_share")
    private Double comcastShare;

    @Column(name = "spectrum_share")
    private Double spectrumShare;

    @Column(name = "cox_share")
    private Double coxShare;

    @Column(name = "others_share")
    private Double othersShare;

    private String marketLeader;

    @Column(name = "att_opportunity")
    private String attOpportunity; // low, medium, high

    @Column(name = "growth_trend")
    private String growthTrend;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    @PrePersist
    @PreUpdate
    public void onUpdate() {
        this.lastUpdated = LocalDateTime.now();
        this.marketLeader = determineLeader();
    }

    private String determineLeader() {
        double max = Math.max(Math.max(Math.max(attShare, verizonShare), tmobileShare), Math.max(comcastShare, spectrumShare));
        if (max == attShare) return "AT&T";
        if (max == verizonShare) return "Verizon";
        if (max == tmobileShare) return "T-Mobile";
        if (max == comcastShare) return "Comcast";
        return "Spectrum";
    }
}
