package com.hexaware.spring_automobile;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;


@SpringBootApplication
@EnableMethodSecurity
public class SpringAutomobileCsApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringAutomobileCsApplication.class, args);
	}

}
