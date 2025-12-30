package com.github.peachy006.storeboughtbackendproper;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = { DataSourceAutoConfiguration.class })
public class StoreBoughtBackendProperApplication {

    public static void main(String[] args) {
        SpringApplication.run(StoreBoughtBackendProperApplication.class, args);
    }

}
