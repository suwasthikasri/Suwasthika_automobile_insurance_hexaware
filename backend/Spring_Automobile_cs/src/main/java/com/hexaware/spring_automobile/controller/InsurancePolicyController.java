package com.hexaware.spring_automobile.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.hexaware.spring_automobile.entity.InsurancePolicyEntity;
import com.hexaware.spring_automobile.pojo.InsurancePolicy;
import com.hexaware.spring_automobile.service.interfaces.IInsurancePolicyService;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/policies")
public class InsurancePolicyController {

    @Autowired
    private IInsurancePolicyService policyService;

    
    @PreAuthorize("hasRole('OFFICER')")
    @PostMapping("/add")
    public int addPolicy(@Valid @RequestBody InsurancePolicy policy) {
        return policyService.addPolicy(policy);
    }

   
    @PreAuthorize("hasAnyRole('USER','OFFICER')")
    @GetMapping("/all")
    public List<InsurancePolicyEntity> getAllPolicies() {
        return policyService.getAllPolicies();
    }

   
    @PreAuthorize("hasAnyRole('USER','OFFICER')")
    @GetMapping("/{policyId}")
    public InsurancePolicyEntity getPolicyById(@PathVariable Long policyId) {
        return policyService.getPolicyById(policyId);
    }

    
    @PreAuthorize("hasRole('OFFICER')")
    @PutMapping("/update")
    public int updatePolicy(@Valid @RequestBody InsurancePolicy policy) {
        return policyService.updatePolicy(policy);
    }

   
    @PreAuthorize("hasRole('OFFICER')")
    @PutMapping("/activate/{policyId}")
    public int activatePolicy(@PathVariable Long policyId) {
        return policyService.activatePolicy(policyId);
    }

    
    @PreAuthorize("hasRole('OFFICER')")
    @PutMapping("/deactivate/{policyId}")
    public int deactivatePolicy(@PathVariable Long policyId) {
        return policyService.deactivatePolicy(policyId);
    }

    
    @PreAuthorize("hasAnyRole('USER','OFFICER')")
    @GetMapping("/category/{category}")
    public List<InsurancePolicyEntity> findPoliciesByVehicleCategory(@PathVariable String category) {
        return policyService.findPoliciesByVehicleCategory(category);
    }
}