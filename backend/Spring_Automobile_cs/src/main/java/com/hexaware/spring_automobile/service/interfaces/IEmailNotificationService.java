package com.hexaware.spring_automobile.service.interfaces;

public interface IEmailNotificationService 
{
	 int sendQuoteEmail(Long proposalId);

	    int sendPolicyEmail(Long proposalId);

	    int sendPremiumReminder(Long proposalId);
	    
	    
}
