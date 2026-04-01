package com.hexaware.spring_automobile.service.implementation;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.hexaware.spring_automobile.entity.PolicyProposalEntity;
import com.hexaware.spring_automobile.entity.PolicyProposalEntity.Status;
import com.hexaware.spring_automobile.pojo.PolicyProposal;

@SpringBootTest
@Transactional
class PolicyProposalServiceImplTest {

    @Autowired
    private PolicyProposalServiceImpl proposalService;

    @Test
    void testCreateProposal() {
        PolicyProposal proposal = new PolicyProposal();
        proposal.setVehicleMake("Toyota");
        proposal.setVehicleModel("Innova");
        proposal.setVehicleYear(2023);
        proposal.setRegistrationNumber("TN01AB1234");
        proposal.setVehicleValue(500000.0);

        int result = proposalService.createProposal(proposal);

        assertEquals(1, result);
    }

    @Test
    void testGetProposalById() {
        PolicyProposal proposal = new PolicyProposal();
        proposal.setRegistrationNumber("UNIQUE123");
        proposalService.createProposal(proposal);

        List<PolicyProposalEntity> all = proposalService.getAllProposals();
        Long id = all.get(all.size() - 1).getProposalId();

        PolicyProposalEntity result = proposalService.getProposalById(id);

        assertNotNull(result);
        assertEquals(id, result.getProposalId());
    }

    @Test
    void testApproveProposal() {
        PolicyProposal proposal = new PolicyProposal();
        proposalService.createProposal(proposal);
        
        List<PolicyProposalEntity> all = proposalService.getAllProposals();
        Long id = all.get(all.size() - 1).getProposalId();

        int result = proposalService.approveProposal(id);

        assertEquals(1, result);
        assertEquals(Status.GENERATED, proposalService.getProposalById(id).getStatus());
    }

    @Test
    void testRejectProposal() {
        PolicyProposal proposal = new PolicyProposal();
        proposalService.createProposal(proposal);
        
        List<PolicyProposalEntity> all = proposalService.getAllProposals();
        Long id = all.get(all.size() - 1).getProposalId();

        int result = proposalService.rejectProposal(id);

        assertEquals(1, result);
        assertEquals(Status.DOWNLOADED, proposalService.getProposalById(id).getStatus());
    }

    @Test
    void testGetAllProposals() {
        PolicyProposal p1 = new PolicyProposal();
        p1.setRegistrationNumber("REG1");
        PolicyProposal p2 = new PolicyProposal();
        p2.setRegistrationNumber("REG2");

        proposalService.createProposal(p1);
        proposalService.createProposal(p2);

        List<PolicyProposalEntity> result = proposalService.getAllProposals();

        assertTrue(result.size() >= 2);
    }
}