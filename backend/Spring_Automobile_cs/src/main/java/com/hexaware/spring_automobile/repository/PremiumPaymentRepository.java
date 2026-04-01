package com.hexaware.spring_automobile.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.hexaware.spring_automobile.entity.PremiumPaymentEntity;

@Repository
public interface PremiumPaymentRepository extends JpaRepository<PremiumPaymentEntity, Long> {

    @Query(value="SELECT * FROM premium_payments WHERE proposal_id = ?1", nativeQuery=true)
    PremiumPaymentEntity findByProposalId(Long proposalId);

    @Query(value="SELECT * FROM premium_payments WHERE payment_status = ?1", nativeQuery=true)
    List<PremiumPaymentEntity> findPaymentsByStatus(String status);

}