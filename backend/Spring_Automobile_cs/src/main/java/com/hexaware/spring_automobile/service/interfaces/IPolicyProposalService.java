package com.hexaware.spring_automobile.service.interfaces;

import java.util.List;


import com.hexaware.spring_automobile.pojo.PolicyProposal;
import com.hexaware.spring_automobile.entity.PolicyProposalEntity;
public interface IPolicyProposalService 
{

	int createProposal(PolicyProposal proposal);

    PolicyProposalEntity getProposalById(Long proposalId);

    List<PolicyProposalEntity> getProposalsByUser(Long userId);

    List<PolicyProposalEntity> getAllProposals();

    int approveProposal(Long proposalId);

    int rejectProposal(Long proposalId);

    int updateProposalStatus(Long proposalId, String status);
    
    List<PolicyProposalEntity> findProposalsByStatus(String status);
}
