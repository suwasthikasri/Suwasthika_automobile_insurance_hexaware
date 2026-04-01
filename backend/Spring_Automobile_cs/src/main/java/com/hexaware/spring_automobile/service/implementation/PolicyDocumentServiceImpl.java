package com.hexaware.spring_automobile.service.implementation;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.spring_automobile.entity.PolicyDocumentEntity;
import com.hexaware.spring_automobile.pojo.PolicyDocument;
import com.hexaware.spring_automobile.repository.PolicyDocumentRepository;
import com.hexaware.spring_automobile.service.interfaces.IPolicyDocumentService;
@Service
public class PolicyDocumentServiceImpl implements IPolicyDocumentService {

    private static final Logger logger = LoggerFactory.getLogger(PolicyDocumentServiceImpl.class);

    @Autowired
    private PolicyDocumentRepository documentRepository;

    @Override
    public int generatePolicyDocument(PolicyDocument document) {

        logger.info("Generating policy document for file: {}", document.getFileName());

        PolicyDocumentEntity entity = new PolicyDocumentEntity();

        entity.setFileName(document.getFileName());
        entity.setFilePath(document.getFilePath());

        documentRepository.save(entity);

        logger.info("Policy document generated successfully");

        return 1;
    }

    @Override
    public PolicyDocumentEntity getDocumentByProposal(Long proposalId) {

        logger.info("Fetching document for proposal id: {}", proposalId);

        return documentRepository.findByProposalId(proposalId);
    }

    @Override
    public List<PolicyDocumentEntity> getAllDocuments() {

        logger.info("Fetching all policy documents");

        return documentRepository.findAll();
    }

    @Override
    public List<PolicyDocumentEntity> findDocumentsByUser(Long userId) {

        logger.info("Fetching documents for user id: {}", userId);

        return documentRepository.findDocumentsByUser(userId);
    }
}