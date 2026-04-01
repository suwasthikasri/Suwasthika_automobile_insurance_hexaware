package com.hexaware.spring_automobile.service.implementation;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.hexaware.spring_automobile.entity.PremiumPaymentEntity;
import com.hexaware.spring_automobile.pojo.PremiumPayment;

@SpringBootTest
@Transactional
class PremiumPaymentServiceImplTest {

    @Autowired
    private PremiumPaymentServiceImpl paymentService;

    @Test
    void testMakePayment() {
        PremiumPayment payment = new PremiumPayment();
        payment.setAmount(5000.0);
        payment.setTransactionId("TXN123");

        int result = paymentService.makePayment(payment);

        assertEquals(1, result);
    }

    @Test
    void testGetPaymentByProposal() {
        PremiumPayment payment = new PremiumPayment();
        payment.setTransactionId("PROP_TXN_99");
        paymentService.makePayment(payment);

        PremiumPaymentEntity result = paymentService.getPaymentByProposal(1L);

        assertNotNull(result);
    }

    @Test
    void testGetAllPayments() {
        PremiumPayment p1 = new PremiumPayment();
        p1.setTransactionId("TXN_A");
        PremiumPayment p2 = new PremiumPayment();
        p2.setTransactionId("TXN_B");

        paymentService.makePayment(p1);
        paymentService.makePayment(p2);

        List<PremiumPaymentEntity> result = paymentService.getAllPayments();

        assertTrue(result.size() >= 2);
    }

    @Test
    void testFindPaymentsByStatus() {
        PremiumPayment p1 = new PremiumPayment();
        p1.setTransactionId("TXN_SUCCESS");
        paymentService.makePayment(p1);

        List<PremiumPaymentEntity> result = paymentService.findPaymentsByStatus("COMPLETED");

        assertNotNull(result);
    }
}