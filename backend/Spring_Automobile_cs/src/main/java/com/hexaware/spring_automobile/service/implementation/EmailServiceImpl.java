package com.hexaware.spring_automobile.service.implementation;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.spring_automobile.entity.EmailNotificationEntity;
import com.hexaware.spring_automobile.repository.EmailNotificationRepository;
import com.hexaware.spring_automobile.service.interfaces.IEmailNotificationService;
import com.hexaware.spring_automobile.util.EmailService;

@Service
public class EmailServiceImpl implements IEmailNotificationService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Autowired
    private EmailNotificationRepository emailRepository;

    @Override
    public int sendQuoteEmail(Long proposalId) {

        logger.info("Sending quote email for proposal id: {}", proposalId);

        EmailNotificationEntity email = new EmailNotificationEntity();

        EmailService.sendEmail(
                "customer@gmail.com",
                "Quote Generated",
                "Your insurance quote for proposal " + proposalId + " is ready."
        );

        logger.info("Quote email sent successfully for proposal id: {}", proposalId);

        return 1;
    }

    @Override
    public int sendPolicyEmail(Long proposalId) {

        logger.info("Sending policy issued email for proposal id: {}", proposalId);

        EmailService.sendEmail(
                "customer@gmail.com",
                "Policy Issued",
                "Your automobile insurance policy has been issued."
        );

        logger.info("Policy email sent successfully for proposal id: {}", proposalId);

        return 1;
    }

    @Override
    public int sendPremiumReminder(Long proposalId) {

        logger.info("Sending premium reminder email for proposal id: {}", proposalId);

        EmailService.sendEmail(
                "customer@gmail.com",
                "Premium Reminder",
                "Your premium payment is due."
        );

        logger.info("Premium reminder email sent successfully for proposal id: {}", proposalId);

        return 1;
    }
}