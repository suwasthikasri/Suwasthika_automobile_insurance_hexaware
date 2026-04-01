package com.hexaware.spring_automobile.service.interfaces;

import java.util.List;

import com.hexaware.spring_automobile.entity.PolicyDocumentEntity;
import com.hexaware.spring_automobile.pojo.PolicyDocument;

public interface IPolicyDocumentService 
{
	 int generatePolicyDocument(PolicyDocument document);

	    PolicyDocumentEntity getDocumentByProposal(Long proposalId);

	    List<PolicyDocumentEntity> getAllDocuments();
	    
	    List<PolicyDocumentEntity> findDocumentsByUser(Long userId);

	   
}
