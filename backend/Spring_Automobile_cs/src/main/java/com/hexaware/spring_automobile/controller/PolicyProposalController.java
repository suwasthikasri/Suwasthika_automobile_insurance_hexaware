package com.hexaware.spring_automobile.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.hexaware.spring_automobile.entity.PolicyProposalEntity;
import com.hexaware.spring_automobile.pojo.PolicyProposal;
import com.hexaware.spring_automobile.service.interfaces.IPolicyProposalService;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/proposals")
public class PolicyProposalController {

    @Autowired
    private IPolicyProposalService proposalService;

    
    @PreAuthorize("hasRole('USER')")
    @PostMapping("/create")
    public int createProposal(@RequestBody PolicyProposal proposal) {

        return proposalService.createProposal(proposal);
    }

    
    @PreAuthorize("hasAnyRole('USER','OFFICER')")
    @GetMapping("/{proposalId}")
    public PolicyProposalEntity getProposalById(@PathVariable Long proposalId) {

        return proposalService.getProposalById(proposalId);
    }

    
    @PreAuthorize("hasAnyRole('USER','OFFICER')")
    @GetMapping("/user/{userId}")
    public List<PolicyProposalEntity> getProposalsByUser(@PathVariable Long userId) {

        return proposalService.getProposalsByUser(userId);
    }

    
    @PreAuthorize("hasRole('OFFICER')")
    @GetMapping("/all")
    public List<PolicyProposalEntity> getAllProposals() {

        return proposalService.getAllProposals();
    }

    
    @PreAuthorize("hasRole('OFFICER')")
    @PutMapping("/approve/{proposalId}")
    public int approveProposal(@PathVariable Long proposalId) {

        return proposalService.approveProposal(proposalId);
    }

   
    @PreAuthorize("hasRole('OFFICER')")
    @PutMapping("/reject/{proposalId}")
    public int rejectProposal(@PathVariable Long proposalId) {

        return proposalService.rejectProposal(proposalId);
    }

    
    @PreAuthorize("hasRole('OFFICER')")
    @PutMapping("/status/{proposalId}/{status}")
    public int updateProposalStatus(@PathVariable Long proposalId, @PathVariable String status) {

        return proposalService.updateProposalStatus(proposalId, status);
    }

    
    @PreAuthorize("hasRole('OFFICER')")
    @GetMapping("/status/{status}")
    public List<PolicyProposalEntity> findProposalsByStatus(@PathVariable String status) {

        return proposalService.findProposalsByStatus(status);
    }
}