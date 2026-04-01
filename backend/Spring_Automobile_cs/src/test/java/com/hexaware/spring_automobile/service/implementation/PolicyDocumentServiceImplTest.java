package com.hexaware.spring_automobile.service.implementation;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.hexaware.spring_automobile.entity.PolicyDocumentEntity;
import com.hexaware.spring_automobile.pojo.PolicyDocument;

@SpringBootTest
@Transactional
class PolicyDocumentServiceImplTest {

    @Autowired
    private PolicyDocumentServiceImpl documentService;

    @Test
    void testGeneratePolicyDocument() {
        PolicyDocument doc = new PolicyDocument();
        doc.setFileName("policy.pdf");
        doc.setFilePath("/documents/policy.pdf");

        int result = documentService.generatePolicyDocument(doc);

        assertEquals(1, result);
    }

    @Test
    void testGetDocumentByProposal() {
        PolicyDocument doc = new PolicyDocument();
        doc.setFileName("proposal_doc.pdf");
        documentService.generatePolicyDocument(doc);

        List<PolicyDocumentEntity> allDocs = documentService.getAllDocuments();
        PolicyDocumentEntity latest = allDocs.get(allDocs.size() - 1);

        PolicyDocumentEntity result = documentService.getDocumentByProposal(1L);
        
        assertNotNull(result);
    }

    @Test
    void testGetAllDocuments() {
        PolicyDocument doc1 = new PolicyDocument();
        doc1.setFileName("doc1.pdf");
        PolicyDocument doc2 = new PolicyDocument();
        doc2.setFileName("doc2.pdf");

        documentService.generatePolicyDocument(doc1);
        documentService.generatePolicyDocument(doc2);

        List<PolicyDocumentEntity> result = documentService.getAllDocuments();

        assertTrue(result.size() >= 2);
    }

    @Test
    void testFindDocumentsByUser() {
        PolicyDocument doc = new PolicyDocument();
        doc.setFileName("user_doc.pdf");
        documentService.generatePolicyDocument(doc);

        List<PolicyDocumentEntity> result = documentService.findDocumentsByUser(1L);

        assertNotNull(result);
    }
}