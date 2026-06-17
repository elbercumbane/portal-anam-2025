package com.anam;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PortalAnamApplication {

    public static void main(String[] args) {
        SpringApplication.run(PortalAnamApplication.class, args);
    }
}

