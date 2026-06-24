package com.att.feedback.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String provider;

    @Column(length = 2000)
    private String reviewText;

    @Column(nullable = false)
    private Double rating; // 1.0 - 5.0

    private String sentiment; // POSITIVE, NEUTRAL, NEGATIVE

    private Double sentimentScore; // -1.0 to 1.0

    private String category; // network, pricing, customer_service, value, app

    private String stateId;

    private String source; // app_store, google_play, survey, social_media

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
