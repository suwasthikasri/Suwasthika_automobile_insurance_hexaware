package com.hexaware.spring_automobile.service.implementation;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.hexaware.spring_automobile.entity.ClaimEntity;
import com.hexaware.spring_automobile.entity.ClaimEntity.ClaimStatus;
import com.hexaware.spring_automobile.pojo.Claim;

@SpringBootTest
@Transactional 
class ClaimServiceImplTest {

    @Autowired
    private ClaimServiceImpl claimService;

    @Test
    void testFileClaim() {
        Claim claim = new Claim();
        claim.setClaimReference("REF100");
        claim.setClaimReason("General Wear");
        claim.setClaimAmount(new BigDecimal("1500"));
        int result = claimService.fileClaim(claim);

        assertEquals(1, result);
    }

    @Test
    void testGetClaimById() {
        
        Claim claim = new Claim();
        claim.setClaimReference("SEARCH_ME");
        claimService.fileClaim(claim);
        
        List<ClaimEntity> list = claimService.getAllClaims();
        Long id = list.get(list.size() - 1).getClaimId();

        ClaimEntity result = claimService.getClaimById(id);
        
        assertNotNull(result);
        assertEquals(id, result.getClaimId());
    }

    @Test
    void testApproveClaim() {
        Claim claim = new Claim();
        claimService.fileClaim(claim);
        Long id = claimService.getAllClaims().get(0).getClaimId();

        int result = claimService.approveClaim(id);

        assertEquals(1, result);
        assertEquals(ClaimStatus.APPROVED, claimService.getClaimById(id).getClaimStatus());
    }

    @Test
    void testRejectClaim() {
        Claim claim = new Claim();
        claimService.fileClaim(claim);
        Long id = claimService.getAllClaims().get(0).getClaimId();

        int result = claimService.rejectClaim(id);

        assertEquals(1, result);
        assertEquals(ClaimStatus.REJECTED, claimService.getClaimById(id).getClaimStatus());
    }

    @Test
    void testProcessClaimPayment() {
        Claim claim = new Claim();
        claimService.fileClaim(claim);
        Long id = claimService.getAllClaims().get(0).getClaimId();

        int result = claimService.processClaimPayment(id);

        assertEquals(1, result);
        assertEquals(ClaimStatus.PAID, claimService.getClaimById(id).getClaimStatus());
    }

    @Test
    void testGetAllClaims() {
        Claim claim = new Claim();
        claimService.fileClaim(claim);

        List<ClaimEntity> result = claimService.getAllClaims();

        
        assertTrue(result.size() > 0);
    }
}