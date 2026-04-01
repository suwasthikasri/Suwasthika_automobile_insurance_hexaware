package com.hexaware.spring_automobile.service.interfaces;

import java.util.List;


 import com.hexaware.spring_automobile.entity.PremiumPaymentEntity;
import com.hexaware.spring_automobile.pojo.PremiumPayment;
public interface IPremiumPaymentService 
{
	int makePayment(PremiumPayment payment);

    PremiumPaymentEntity getPaymentByProposal(Long proposalId);

    List<PremiumPaymentEntity> getAllPayments();

    List<PremiumPaymentEntity> findPaymentsByStatus(String status);
}
