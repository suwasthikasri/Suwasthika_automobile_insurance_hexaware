package com.hexaware.spring_automobile.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.hexaware.spring_automobile.entity.OfficerActionEntity;
import com.hexaware.spring_automobile.pojo.OfficerAction;
import com.hexaware.spring_automobile.service.interfaces.IOfficerActionService;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/officer-actions")
public class OfficerActionController {

    @Autowired
    private IOfficerActionService officerActionService;

    @PreAuthorize("hasRole('OFFICER')")
    @PostMapping("/record")
    public int recordAction(@Valid @RequestBody OfficerAction action) {

        return officerActionService.recordAction(action);
    }

    
    @PreAuthorize("hasAnyRole('USER','OFFICER')")
    @GetMapping("/proposal/{proposalId}")
    public List<OfficerActionEntity> getActionsByProposal(@PathVariable Long proposalId) {

        return officerActionService.getActionsByProposal(proposalId);
    }
}