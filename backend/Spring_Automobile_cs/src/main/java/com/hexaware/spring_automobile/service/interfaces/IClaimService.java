package com.hexaware.spring_automobile.service.interfaces;

import java.util.List;

import com.hexaware.spring_automobile.entity.ClaimEntity;


import com.hexaware.spring_automobile.pojo.Claim;

public interface IClaimService {
	int fileClaim(Claim claim);

    ClaimEntity getClaimById(Long claimId);

    List<ClaimEntity> getClaimsByUser(Long userId);

    List<ClaimEntity> getAllClaims();

    int approveClaim(Long claimId);

    int rejectClaim(Long claimId);

    int processClaimPayment(Long claimId);
    
    List<ClaimEntity> findClaimsByStatus(ClaimEntity.ClaimStatus status);
}
