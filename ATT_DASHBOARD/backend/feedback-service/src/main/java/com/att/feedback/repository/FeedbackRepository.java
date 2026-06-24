package com.att.feedback.repository;

import com.att.feedback.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByProvider(String provider);
    List<Feedback> findByProviderAndSentiment(String provider, String sentiment);
    List<Feedback> findByStateId(String stateId);

    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.provider = :provider")
    Double findAvgRatingByProvider(String provider);

    @Query("SELECT f.provider, AVG(f.rating), COUNT(f) FROM Feedback f GROUP BY f.provider ORDER BY AVG(f.rating) DESC")
    List<Object[]> findProviderRankings();
}
