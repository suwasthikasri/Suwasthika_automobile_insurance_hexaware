package com.hexaware.spring_automobile.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    public static void sendEmail(String to, String subject, String message) {

        log.info("Sending email to {}", to);

        System.out.println("Email Sent");
        System.out.println("To: " + to);
        System.out.println("Subject: " + subject);
        System.out.println("Message: " + message);
    }
}