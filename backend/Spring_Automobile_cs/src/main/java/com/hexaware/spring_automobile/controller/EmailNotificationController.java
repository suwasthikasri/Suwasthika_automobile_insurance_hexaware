package com.hexaware.spring_automobile.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.hexaware.spring_automobile.service.interfaces.IEmailNotificationService;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/email")
public class EmailNotificationController {

    @Autowired
    private IEmailNotificationService emailService;

   
    @PreAuthorize("hasRole('OFFICER')")
    @PostMapping("/send-quote/{proposalId}")
    public int sendQuoteEmail(@PathVariable Long proposalId) {

        return emailService.sendQuoteEmail(proposalId);
    }

    
    @PreAuthorize("hasRole('OFFICER')")
    @PostMapping("/send-policy/{proposalId}")
    public int sendPolicyEmail(@PathVariable Long proposalId) {

        return emailService.sendPolicyEmail(proposalId);
    }

    
    @PreAuthorize("hasRole('OFFICER')")
    @PostMapping("/premium-reminder/{proposalId}")
    public int sendPremiumReminder(@PathVariable Long proposalId) {

        return emailService.sendPremiumReminder(proposalId);
    }
}