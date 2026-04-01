package com.hexaware.spring_automobile.service.implementation;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

class EmailServiceImplTest {

    private EmailServiceImpl emailService = new EmailServiceImpl();

    @Test
    void testSendQuoteEmail() {
        int result = emailService.sendQuoteEmail(1L);
        assertEquals(1, result);
    }

    @Test
    void testSendPolicyEmail() {
        int result = emailService.sendPolicyEmail(1L);
        assertEquals(1, result);
    }

    @Test
    void testSendPremiumReminder() {
        int result = emailService.sendPremiumReminder(1L);
        assertEquals(1, result);
    }
}