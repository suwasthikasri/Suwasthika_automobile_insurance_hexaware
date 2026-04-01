package com.hexaware.spring_automobile.service.implementation;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.spring_automobile.entity.InsurancePolicyEntity;
import com.hexaware.spring_automobile.exception.ResourceNotFoundException;
import com.hexaware.spring_automobile.pojo.InsurancePolicy;
import com.hexaware.spring_automobile.repository.InsurancePolicyRepository;
import com.hexaware.spring_automobile.service.interfaces.IInsurancePolicyService;
@Service
public class InsurancePolicyServiceImpl implements IInsurancePolicyService {

    private static final Logger logger = LoggerFactory.getLogger(InsurancePolicyServiceImpl.class);

    @Autowired
    private InsurancePolicyRepository policyRepository;

    @Override
    public int addPolicy(InsurancePolicy policy) {

        logger.info("Adding new insurance policy: {}", policy.getPolicyName());

        InsurancePolicyEntity entity = new InsurancePolicyEntity();

        entity.setPolicyName(policy.getPolicyName());
        entity.setDescription(policy.getDescription());
        entity.setBasePremium(policy.getBasePremium());

        policyRepository.save(entity);

        logger.info("Policy added successfully: {}", policy.getPolicyName());

        return 1;
    }

    @Override
    public List<InsurancePolicyEntity> getAllPolicies() {

        logger.info("Fetching all insurance policies");

        return policyRepository.findAll();
    }

    @Override
    public InsurancePolicyEntity getPolicyById(Long policyId) {

        logger.info("Fetching policy with id: {}", policyId);

        return policyRepository.findById(policyId)
                .orElseThrow(() -> {
                    logger.error("Policy not found with id: {}", policyId);
                    return new ResourceNotFoundException("Policy not found");
                });
    }

    @Override
    public int activatePolicy(Long policyId) {

        logger.info("Activating policy with id: {}", policyId);

        InsurancePolicyEntity entity = getPolicyById(policyId);

        entity.setIsActive(true);

        policyRepository.save(entity);

        logger.info("Policy activated successfully");

        return 1;
    }

    @Override
    public int deactivatePolicy(Long policyId) {

        logger.warn("Deactivating policy with id: {}", policyId);

        InsurancePolicyEntity entity = getPolicyById(policyId);

        entity.setIsActive(false);

        policyRepository.save(entity);

        logger.info("Policy deactivated successfully");

        return 1;
    }

    @Override
    public List<InsurancePolicyEntity> findPoliciesByVehicleCategory(String category) {

        logger.info("Fetching policies for vehicle category: {}", category);

        return policyRepository.findPoliciesByVehicleCategory(category);
    }

    @Override
    public int updatePolicy(InsurancePolicy policy) {

        logger.info("Updating policy with id: {}", policy.getPolicyId());

        InsurancePolicyEntity entity = policyRepository.findById(policy.getPolicyId())
                .orElseThrow(() -> {
                    logger.error("Policy not found with id: {}", policy.getPolicyId());
                    return new RuntimeException("Policy not found");
                });

        entity.setPolicyName(policy.getPolicyName());
        entity.setDescription(policy.getDescription());
        entity.setBasePremium(policy.getBasePremium());
        entity.setCoverageDetails(policy.getCoverageDetails());
        entity.setAddOns(policy.getAddOns());

        policyRepository.save(entity);

        logger.info("Policy updated successfully");

        return 1;
    }
}