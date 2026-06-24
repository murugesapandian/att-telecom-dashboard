package com.att.feedback.controller;

import com.att.feedback.model.Feedback;
import com.att.feedback.service.FeedbackService;
import com.att.feedback.service.SentimentAnalysisService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/feedback")
@RequiredArgsConstructor
@Tag(name = "Customer Feedback", description = "Customer feedback and sentiment analysis")
@CrossOrigin(origins = {"http://localhost:3000"})
public class FeedbackController {

    private final FeedbackService feedbackService;
    private final SentimentAnalysisService sentimentService;

    @GetMapping("/providers/top5")
    @Operation(summary = "Get top 5 providers by customer satisfaction")
    public ResponseEntity<List<Map<String, Object>>> getTop5Providers() {
        return ResponseEntity.ok(feedbackService.getTop5ProvidersSummary());
    }

    @GetMapping("/provider/{provider}")
    @Operation(summary = "Get feedback summary for a specific provider")
    public ResponseEntity<Map<String, Object>> getProviderFeedback(@PathVariable String provider) {
        return ResponseEntity.ok(feedbackService.getProviderFeedbackSummary(provider));
    }

    @GetMapping("/provider/{provider}/trend")
    @Operation(summary = "Get 12-month satisfaction trend for provider")
    public ResponseEntity<List<Map<String, Object>>> getProviderTrend(@PathVariable String provider) {
        return ResponseEntity.ok(feedbackService.getProviderMonthlyTrend(provider));
    }

    @PostMapping
    @Operation(summary = "Submit new customer feedback")
    public ResponseEntity<Feedback> submitFeedback(@RequestBody Feedback feedback) {
        return ResponseEntity.ok(feedbackService.saveFeedback(feedback));
    }

    @PostMapping("/analyze")
    @Operation(summary = "Analyze sentiment of text")
    public ResponseEntity<Map<String, Object>> analyzeSentiment(@RequestBody Map<String, String> request) {
        String text = request.get("text");
        String sentiment = sentimentService.classifySentiment(text);
        double score = sentimentService.calculateSentimentScore(text);
        return ResponseEntity.ok(Map.of("sentiment", sentiment, "score", score, "text", text));
    }

    @GetMapping("/nps/comparison")
    @Operation(summary = "Get NPS score comparison across providers")
    public ResponseEntity<List<Map<String, Object>>> getNpsComparison() {
        return ResponseEntity.ok(feedbackService.getNpsComparison());
    }

    @GetMapping("/att/improvement-areas")
    @Operation(summary = "Get AT&T strategic improvement areas")
    public ResponseEntity<List<Map<String, Object>>> getAttImprovementAreas() {
        return ResponseEntity.ok(feedbackService.getAttImprovementAreas());
    }
}
