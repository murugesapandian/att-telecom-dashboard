package com.att.plan;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@OpenAPIDefinition(
    info = @Info(
        title = "AT&T Plan Comparison API",
        version = "1.0.0",
        description = "Wireless and broadband plan comparison across AT&T, Verizon, T-Mobile, Comcast, " +
                      "and Spectrum. Price data is based on publicly available provider website pricing " +
                      "as of early 2025 — not connected to AT&T OPUS live catalog.",
        contact = @Contact(name = "AT&T Business & Strategy Team", email = "murugesapandian@gmail.com")
    ),
    servers = {
        @Server(url = "http://localhost:8084", description = "Direct service"),
        @Server(url = "http://localhost:8080", description = "Via API Gateway")
    }
)
public class PlanComparisonApplication {
    public static void main(String[] args) {
        SpringApplication.run(PlanComparisonApplication.class, args);
    }
}
