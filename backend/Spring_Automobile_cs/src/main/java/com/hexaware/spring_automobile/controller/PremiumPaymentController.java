package com.hexaware.spring_automobile.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.hexaware.spring_automobile.entity.PremiumPaymentEntity;
import com.hexaware.spring_automobile.pojo.PremiumPayment;
import com.hexaware.spring_automobile.service.interfaces.IPremiumPaymentService;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/payments")
public class PremiumPaymentController {

    @Autowired
    private IPremiumPaymentService paymentService;

    
    @PreAuthorize("hasRole('USER')")
    @PostMapping("/pay")
    public int makePayment(@Valid @RequestBody PremiumPayment payment) {

        return paymentService.makePayment(payment);
    }

   
    @PreAuthorize("hasAnyRole('USER','OFFICER')")
    @GetMapping("/proposal/{proposalId}")
    public PremiumPaymentEntity getPaymentByProposal(@PathVariable Long proposalId) {

        return paymentService.getPaymentByProposal(proposalId);
    }

    
    @PreAuthorize("hasRole('OFFICER')")
    @GetMapping("/all")
    public List<PremiumPaymentEntity> getAllPayments() {

        return paymentService.getAllPayments();
    }

    
    @PreAuthorize("hasRole('OFFICER')")
    @GetMapping("/status/{status}")
    public List<PremiumPaymentEntity> findPaymentsByStatus(@PathVariable String status) {

        return paymentService.findPaymentsByStatus(status);
    }
}