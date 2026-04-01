package com.hexaware.spring_automobile.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hexaware.spring_automobile.entity.PolicyProposalEntity;

@Repository
public interface PolicyProposalRepository extends JpaRepository<PolicyProposalEntity, Long> {

    @Query("SELECT p FROM PolicyProposalEntity p WHERE p.userEntity.userId = :userId")
    List<PolicyProposalEntity> findByUserId(@Param("userId") Long userId);

    @Query("SELECT p FROM PolicyProposalEntity p WHERE p.status = :status")
    List<PolicyProposalEntity> findProposalsByStatus(@Param("status") String status);
}