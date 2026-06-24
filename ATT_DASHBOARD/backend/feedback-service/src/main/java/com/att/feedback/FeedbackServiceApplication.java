package com.att.feedback;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@OpenAPIDefinition(
    info = @Info(
        title = "AT&T Customer Feedback & Sentiment API",
        version = "1.0.0",
        description = "Customer satisfaction scores, NPS trends, and keyword-based sentiment analysis " +
                      "for the top 5 US telecom providers. " +
                      "NOTE: All scores are illustrative estimates — not from live VoC or JD Power feeds.",
        contact = @Contact(name = "AT&T Business & Strategy Team", email = "murugesapandian@gmail.com")
    ),
    servers = {
        @Server(url = "http://localhost:8083", description = "Direct service"),
        @Server(url = "http://localhost:8080", description = "Via API Gateway")
    }
)
public class FeedbackServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(FeedbackServiceApplication.class, args);
    }
}
