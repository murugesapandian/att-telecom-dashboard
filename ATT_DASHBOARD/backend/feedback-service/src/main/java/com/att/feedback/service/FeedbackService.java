package com.att.feedback.service;

import com.att.feedback.model.Feedback;
import com.att.feedback.repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final SentimentAnalysisService sentimentService;

    public Feedback saveFeedback(Feedback feedback) {
        feedback.setSentiment(sentimentService.classifySentiment(feedback.getReviewText()));
        feedback.setSentimentScore(sentimentService.calculateSentimentScore(feedback.getReviewText()));
        return feedbackRepository.save(feedback);
    }

    public List<Map<String, Object>> getTop5ProvidersSummary() {
        List<String> providers = List.of("T-Mobile", "Verizon", "AT&T", "Cox", "Dish/Boost Mobile");
        List<Map<String, Object>> results = new ArrayList<>();
        for (int i = 0; i < providers.size(); i++) {
            String provider = providers.get(i);
            Map<String, Object> summary = getProviderFeedbackSummary(provider);
            summary.put("rank", i + 1);
            results.add(summary);
        }
        return results;
    }

    public Map<String, Object> getProviderFeedbackSummary(String provider) {
        List<Feedback> feedbacks = feedbackRepository.findByProvider(provider);
        Map<String, Object> summary = new HashMap<>();
        summary.put("provider", provider);
        summary.put("totalReviews", feedbacks.size());

        if (!feedbacks.isEmpty()) {
            double avgRating = feedbacks.stream().mapToDouble(Feedback::getRating).average().orElse(0.0);
            summary.put("averageRating", Math.round(avgRating * 10.0) / 10.0);

            long positive = feedbacks.stream().filter(f -> "POSITIVE".equals(f.getSentiment())).count();
            long negative = feedbacks.stream().filter(f -> "NEGATIVE".equals(f.getSentiment())).count();
            long neutral = feedbacks.size() - positive - negative;

            summary.put("positive", positive);
            summary.put("negative", negative);
            summary.put("neutral", neutral);
            summary.put("positivePercent", Math.round((positive * 100.0) / feedbacks.size()));
            summary.put("negativePercent", Math.round((negative * 100.0) / feedbacks.size()));
        }
        return summary;
    }

    public List<Map<String, Object>> getProviderMonthlyTrend(String provider) {
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
        List<Map<String, Object>> trend = new ArrayList<>();
        for (String month : months) {
            trend.add(Map.of("month", month, "provider", provider));
        }
        return trend;
    }

    public List<Map<String, Object>> getNpsComparison() {
        return List.of(
            Map.of("provider", "T-Mobile", "nps", 22, "color", "#E20074"),
            Map.of("provider", "Verizon", "nps", 18, "color", "#CD040B"),
            Map.of("provider", "AT&T", "nps", 12, "color", "#00A8E0"),
            Map.of("provider", "Cox", "nps", 2, "color", "#00897B"),
            Map.of("provider", "Dish/Boost", "nps", -2, "color", "#E36F1E"),
            Map.of("provider", "Comcast", "nps", -5, "color", "#CC0000"),
            Map.of("provider", "Charter", "nps", -8, "color", "#0072CE")
        );
    }

    public List<Map<String, Object>> getAttImprovementAreas() {
        return List.of(
            Map.of("area", "Customer Service", "currentScore", 3.6, "targetScore", 4.0, "gap", 0.4, "priority", "Critical", "revenueImpact", "$2.1B"),
            Map.of("area", "Pricing Transparency", "currentScore", 3.4, "targetScore", 3.9, "gap", 0.5, "priority", "High", "revenueImpact", "$1.8B"),
            Map.of("area", "Value for Money", "currentScore", 3.5, "targetScore", 4.0, "gap", 0.5, "priority", "High", "revenueImpact", "$3.2B"),
            Map.of("area", "Rural Network Quality", "currentScore", 3.8, "targetScore", 4.3, "gap", 0.5, "priority", "Medium", "revenueImpact", "$1.4B")
        );
    }
}
