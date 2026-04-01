package com.hexaware.spring_automobile.service.implementation;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.spring_automobile.entity.InsurancePolicyEntity;
import com.hexaware.spring_automobile.entity.PolicyProposalEntity;
import com.hexaware.spring_automobile.entity.UserEntity;
import com.hexaware.spring_automobile.entity.PolicyProposalEntity.Status;
import com.hexaware.spring_automobile.exception.ResourceNotFoundException;
import com.hexaware.spring_automobile.pojo.PolicyProposal;
import com.hexaware.spring_automobile.repository.InsurancePolicyRepository;
import com.hexaware.spring_automobile.repository.PolicyProposalRepository;
import com.hexaware.spring_automobile.repository.UserRepository;
import com.hexaware.spring_automobile.service.interfaces.IPolicyProposalService;
import com.hexaware.spring_automobile.util.PremiumCalculator;
@Service
public class PolicyProposalServiceImpl implements IPolicyProposalService {

    private static final Logger logger = LoggerFactory.getLogger(PolicyProposalServiceImpl.class);

    @Autowired
    private PolicyProposalRepository proposalRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private InsurancePolicyRepository policyRepository;

    

@Override
public int createProposal(PolicyProposal proposal) {
    logger.info("Creating policy proposal for vehicle: {} {}", 
                proposal.getVehicleMake(), proposal.getVehicleModel());

    PolicyProposalEntity entity = new PolicyProposalEntity();

    
    if (proposal.getUser() != null && proposal.getUser().getUserId() != null) {
        UserEntity user = userRepository.findById(proposal.getUser().getUserId())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        entity.setUserEntity(user);
    }

    
    if (proposal.getPolicy() != null && proposal.getPolicy().getPolicyId() != null) {
        InsurancePolicyEntity policy = policyRepository.findById(proposal.getPolicy().getPolicyId())
            .orElseThrow(() -> new ResourceNotFoundException("Policy not found"));
        entity.setPolicy(policy);
    }


    entity.setVehicleMake(proposal.getVehicleMake());
    entity.setVehicleModel(proposal.getVehicleModel());
    entity.setVehicleYear(proposal.getVehicleYear());
    entity.setRegistrationNumber(proposal.getRegistrationNumber());
    entity.setChassisNumber(proposal.getChassisNumber());       
    entity.setEngineNumber(proposal.getEngineNumber());         
    entity.setVehicleValue(proposal.getVehicleValue());
    entity.setSelectedAddOns(proposal.getSelectedAddOns());     

    
    entity.setProposalUniqueId("PROP-" + java.time.Year.now().getValue() 
        + "-" + String.format("%03d", (int)(Math.random() * 1000)));
    entity.setStatus(Status.GENERATED);                         
    entity.setCreatedAt(java.time.LocalDateTime.now());         
    entity.setUpdatedAt(java.time.LocalDateTime.now());

    double premium = PremiumCalculator.calculateBasePremium(proposal.getVehicleValue());
    entity.setQuoteAmount(premium);

    proposalRepository.save(entity);
    logger.info("Policy proposal created successfully");
    return 1;
}

    @Override
    public PolicyProposalEntity getProposalById(Long proposalId) {

        logger.info("Fetching proposal with id: {}", proposalId);

        return proposalRepository.findById(proposalId)
                .orElseThrow(() -> {
                    logger.error("Proposal not found with id {}", proposalId);
                    return new ResourceNotFoundException("Proposal not found");
                });
    }

    @Override
    public List<PolicyProposalEntity> getProposalsByUser(Long userId) {

        logger.info("Fetching proposals for user id: {}", userId);

        return proposalRepository.findByUserId(userId);
    }

    @Override
    public int approveProposal(Long proposalId) {
        logger.info("Approving proposal with id: {}", proposalId);
        PolicyProposalEntity entity = getProposalById(proposalId);
        entity.setStatus(Status.SENT); 
        entity.setUpdatedAt(java.time.LocalDateTime.now());
        proposalRepository.save(entity);
        logger.info("Proposal approved successfully");
        return 1;
    }

    @Override
    public int rejectProposal(Long proposalId) {
        logger.warn("Rejecting proposal with id: {}", proposalId);
        PolicyProposalEntity entity = getProposalById(proposalId);
        entity.setStatus(Status.REJECTED); 
        entity.setUpdatedAt(java.time.LocalDateTime.now());
        proposalRepository.save(entity);
        logger.info("Proposal rejected successfully");
        return 1;
    }

    @Override
    public List<PolicyProposalEntity> findProposalsByStatus(String status) {

        logger.info("Fetching proposals with status: {}", status);

        return proposalRepository.findProposalsByStatus(status);
    }

    @Override
    public List<PolicyProposalEntity> getAllProposals() {

        logger.info("Fetching all policy proposals");

        return proposalRepository.findAll();
    }

    @Override
    public int updateProposalStatus(Long proposalId, String status) {

        logger.info("Updating proposal status for id {} to {}", proposalId, status);

        PolicyProposalEntity proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> {
                    logger.error("Proposal not found with id {}", proposalId);
                    return new RuntimeException("Proposal not found");
                });

        proposal.setStatus(Status.valueOf(status));

        proposalRepository.save(proposal);

        logger.info("Proposal status updated successfully");

        return 1;
    }
}