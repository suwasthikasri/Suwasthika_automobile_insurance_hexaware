package com.hexaware.spring_automobile.service.interfaces;

import java.util.List;


import com.hexaware.spring_automobile.entity.InsurancePolicyEntity;
import com.hexaware.spring_automobile.pojo.InsurancePolicy;
public interface IInsurancePolicyService {
    int addPolicy(InsurancePolicy policy);

    List<InsurancePolicyEntity> getAllPolicies();

    InsurancePolicyEntity getPolicyById(Long policyId);

    int updatePolicy(InsurancePolicy policy);

    int activatePolicy(Long policyId);

    int deactivatePolicy(Long policyId);
    
    List<InsurancePolicyEntity> findPoliciesByVehicleCategory(String category);

}
