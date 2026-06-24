package com.att.analytics.state;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class StateAnalyticsApplication {
    public static void main(String[] args) {
        SpringApplication.run(StateAnalyticsApplication.class, args);
    }
}
