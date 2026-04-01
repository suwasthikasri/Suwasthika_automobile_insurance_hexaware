package com.hexaware.spring_automobile.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hexaware.spring_automobile.entity.ClaimEntity;

@Repository
public interface ClaimRepository extends JpaRepository<ClaimEntity, Long> {
	
	@Query("SELECT c FROM ClaimEntity c JOIN FETCH c.proposal p WHERE p.userEntity.userId = :userId")
    List<ClaimEntity> findClaimsByUser(@Param("userId") Long userId);

    @Query("SELECT c FROM ClaimEntity c JOIN FETCH c.proposal")
    List<ClaimEntity> findAllWithProposal();

    @Query("SELECT c FROM ClaimEntity c JOIN FETCH c.proposal WHERE c.claimStatus = :status")
    List<ClaimEntity> findClaimsByStatus(@Param("status") ClaimEntity.ClaimStatus status);

    @Query("SELECT c FROM ClaimEntity c WHERE c.proposal.proposalId = :proposalId")
    List<ClaimEntity> findClaimsByProposalId(@Param("proposalId") Long proposalId);






}