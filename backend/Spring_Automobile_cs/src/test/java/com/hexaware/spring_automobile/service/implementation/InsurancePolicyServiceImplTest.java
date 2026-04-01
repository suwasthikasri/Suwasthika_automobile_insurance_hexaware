package com.hexaware.spring_automobile.service.implementation;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.hexaware.spring_automobile.entity.InsurancePolicyEntity;
import com.hexaware.spring_automobile.pojo.InsurancePolicy;

@SpringBootTest
@Transactional
class InsurancePolicyServiceImplTest {

    @Autowired
    private InsurancePolicyServiceImpl policyService;

    @Test
    void testAddPolicy() {
        InsurancePolicy policy = new InsurancePolicy();
        policy.setPolicyName("Car Insurance");
        policy.setDescription("Full coverage");
        policy.setBasePremium(5000.0);

        int result = policyService.addPolicy(policy);

        assertEquals(1, result);
    }

    @Test
    void testGetAllPolicies() {
        InsurancePolicy p1 = new InsurancePolicy();
        p1.setPolicyName("Policy 1");
        InsurancePolicy p2 = new InsurancePolicy();
        p2.setPolicyName("Policy 2");

        policyService.addPolicy(p1);
        policyService.addPolicy(p2);

        List<InsurancePolicyEntity> result = policyService.getAllPolicies();

        assertTrue(result.size() >= 2);
    }

    @Test
    void testGetPolicyById() {
        InsurancePolicy policy = new InsurancePolicy();
        policy.setPolicyName("Search Policy");
        policyService.addPolicy(policy);
        
        Long id = policyService.getAllPolicies().get(0).getPolicyId();

        InsurancePolicyEntity result = policyService.getPolicyById(id);

        assertNotNull(result);
        assertEquals(id, result.getPolicyId());
    }

    @Test
    void testActivatePolicy() {
        InsurancePolicy policy = new InsurancePolicy();
        policyService.addPolicy(policy);
        
        Long id = policyService.getAllPolicies().get(0).getPolicyId();

        int result = policyService.activatePolicy(id);

        assertEquals(1, result);
        assertTrue(policyService.getPolicyById(id).getIsActive());
    }

    @Test
    void testDeactivatePolicy() {
        InsurancePolicy policy = new InsurancePolicy();
        policyService.addPolicy(policy);
        
        Long id = policyService.getAllPolicies().get(0).getPolicyId();

        int result = policyService.deactivatePolicy(id);

        assertEquals(1, result);
        assertFalse(policyService.getPolicyById(id).getIsActive());
    }
}