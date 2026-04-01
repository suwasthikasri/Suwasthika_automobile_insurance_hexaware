package com.hexaware.spring_automobile.service.implementation;

import java.time.LocalDateTime;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.spring_automobile.entity.PolicyProposalEntity;
import com.hexaware.spring_automobile.entity.PremiumPaymentEntity;
import com.hexaware.spring_automobile.pojo.PremiumPayment;
import com.hexaware.spring_automobile.repository.PolicyProposalRepository;
import com.hexaware.spring_automobile.repository.PremiumPaymentRepository;
import com.hexaware.spring_automobile.service.interfaces.IPremiumPaymentService;
@Service
public class PremiumPaymentServiceImpl implements IPremiumPaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PremiumPaymentServiceImpl.class);

    @Autowired
    private PremiumPaymentRepository paymentRepository;

    
    @Autowired
    private PolicyProposalRepository proposalRepository; 

    @Override
    public int makePayment(PremiumPayment payment) {

        PremiumPaymentEntity entity = new PremiumPaymentEntity();

        
        PolicyProposalEntity proposal = proposalRepository
            .findById(payment.getProposal().getProposalId())
            .orElseThrow(() -> new RuntimeException("Proposal not found"));
        entity.setProposal(proposal);

        entity.setAmount(payment.getAmount());
        entity.setTransactionId(payment.getTransactionId());

        entity.setPaymentMethod(
            PremiumPaymentEntity.PaymentMethod.valueOf(payment.getPaymentMethod().name())
        );
        entity.setPaymentStatus(PremiumPaymentEntity.PaymentStatus.COMPLETED);
        entity.setPaymentReference(payment.getPaymentReference());
        entity.setPaidAt(LocalDateTime.now());
        entity.setCreatedAt(LocalDateTime.now());

        paymentRepository.save(entity);
        return 1;
    }

    @Override
    public PremiumPaymentEntity getPaymentByProposal(Long proposalId) {

        logger.info("Fetching payment for proposal ID: {}", proposalId);

        return paymentRepository.findByProposalId(proposalId);
    }

    @Override
    public List<PremiumPaymentEntity> getAllPayments() {

        logger.info("Fetching all premium payments");

        return paymentRepository.findAll();
    }

    @Override
    public List<PremiumPaymentEntity> findPaymentsByStatus(String status) {

        logger.info("Fetching payments with status: {}", status);

        return paymentRepository.findPaymentsByStatus(status);
    }
}