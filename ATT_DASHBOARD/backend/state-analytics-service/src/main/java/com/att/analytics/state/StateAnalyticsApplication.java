package com.att.analytics.state;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@OpenAPIDefinition(
    info = @Info(
        title = "AT&T State Analytics API",
        version = "1.0.0",
        description = "Market share analytics and competitive intelligence for all 50 US states. " +
                      "Also exposes the /logs endpoint for storing and querying application logs. " +
                      "NOTE: All market data is illustrative/simulated — not sourced from AT&T internal systems.",
        contact = @Contact(name = "AT&T Business & Strategy Team", email = "murugesapandian@gmail.com")
    ),
    servers = {
        @Server(url = "http://localhost:8081", description = "Direct service"),
        @Server(url = "http://localhost:8080", description = "Via API Gateway")
    }
)
public class StateAnalyticsApplication {
    public static void main(String[] args) {
        SpringApplication.run(StateAnalyticsApplication.class, args);
    }
}
