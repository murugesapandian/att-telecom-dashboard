package com.att.feedback.service;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class SentimentAnalysisService {

    private static final Map<String, Double> POSITIVE_WORDS = Map.of(
        "excellent", 0.9, "great", 0.8, "good", 0.6, "fast", 0.7,
        "reliable", 0.8, "love", 0.9, "awesome", 0.9, "best", 0.85,
        "affordable", 0.7, "satisfied", 0.75
    );

    private static final Map<String, Double> NEGATIVE_WORDS = Map.of(
        "terrible", -0.9, "awful", -0.9, "slow", -0.7, "expensive", -0.7,
        "worst", -0.9, "hate", -0.9, "unreliable", -0.8, "disappointed", -0.75,
        "poor", -0.7, "outage", -0.85
    );

    public String classifySentiment(String text) {
        double score = calculateSentimentScore(text);
        if (score > 0.1) return "POSITIVE";
        if (score < -0.1) return "NEGATIVE";
        return "NEUTRAL";
    }

    public double calculateSentimentScore(String text) {
        if (text == null || text.isBlank()) return 0.0;

        String lowerText = text.toLowerCase();
        double totalScore = 0.0;
        int wordCount = 0;

        String[] words = lowerText.split("\\s+");
        for (String word : words) {
            String cleaned = word.replaceAll("[^a-z]", "");
            if (POSITIVE_WORDS.containsKey(cleaned)) {
                totalScore += POSITIVE_WORDS.get(cleaned);
                wordCount++;
            } else if (NEGATIVE_WORDS.containsKey(cleaned)) {
                totalScore += NEGATIVE_WORDS.get(cleaned);
                wordCount++;
            }
        }

        return wordCount > 0 ? totalScore / wordCount : 0.0;
    }

    public Map<String, Object> analyzeProvider(String provider, List<String> reviews) {
        long positive = reviews.stream().filter(r -> "POSITIVE".equals(classifySentiment(r))).count();
        long negative = reviews.stream().filter(r -> "NEGATIVE".equals(classifySentiment(r))).count();
        long neutral = reviews.size() - positive - negative;

        double avgScore = reviews.stream()
            .mapToDouble(this::calculateSentimentScore)
            .average().orElse(0.0);

        Map<String, Object> result = new HashMap<>();
        result.put("provider", provider);
        result.put("totalReviews", reviews.size());
        result.put("positive", positive);
        result.put("negative", negative);
        result.put("neutral", neutral);
        result.put("positivePercent", (positive * 100.0) / reviews.size());
        result.put("negativePercent", (negative * 100.0) / reviews.size());
        result.put("averageSentimentScore", Math.round(avgScore * 1000.0) / 1000.0);

        return result;
    }
}
