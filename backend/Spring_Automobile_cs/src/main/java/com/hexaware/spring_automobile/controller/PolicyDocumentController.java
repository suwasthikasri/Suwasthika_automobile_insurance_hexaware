package com.hexaware.spring_automobile.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.hexaware.spring_automobile.entity.PolicyDocumentEntity;
import com.hexaware.spring_automobile.pojo.PolicyDocument;
import com.hexaware.spring_automobile.service.interfaces.IPolicyDocumentService;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/documents")
public class PolicyDocumentController {

    @Autowired
    private IPolicyDocumentService documentService;

    
    @PreAuthorize("hasRole('OFFICER')")
    @PostMapping("/generate")
    public int generatePolicyDocument(@Valid @RequestBody PolicyDocument document) {

        return documentService.generatePolicyDocument(document);
    }

    
    @PreAuthorize("hasAnyRole('USER','OFFICER')")
    @GetMapping("/proposal/{proposalId}")
    public PolicyDocumentEntity getDocumentByProposal(@PathVariable Long proposalId) {

        return documentService.getDocumentByProposal(proposalId);
    }

    
    @PreAuthorize("hasRole('OFFICER')")
    @GetMapping("/all")
    public List<PolicyDocumentEntity> getAllDocuments() {

        return documentService.getAllDocuments();
    }

    
    @PreAuthorize("hasAnyRole('USER','OFFICER')")
    @GetMapping("/user/{userId}")
    public List<PolicyDocumentEntity> findDocumentsByUser(@PathVariable Long userId) {

        return documentService.findDocumentsByUser(userId);
    }
}