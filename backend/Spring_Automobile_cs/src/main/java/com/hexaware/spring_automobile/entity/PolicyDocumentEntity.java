package com.hexaware.spring_automobile.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;


@Entity
@Table(name="policy_documents")
@NamedQuery(
name="PolicyDocumentEntity.findDocumentsByUser",
query="SELECT d FROM PolicyDocumentEntity d WHERE d.proposal.userEntity.userId = :userId"
)public class PolicyDocumentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long documentId;

    @ManyToOne
    @JoinColumn(name="proposal_id")
    private PolicyProposalEntity proposal;

    private String documentUniqueId;

    @Enumerated(EnumType.STRING)
    private DocumentType documentType;

    private String filePath;

    private String fileName;

    @Enumerated(EnumType.STRING)
    private Status status;

    private String sentToEmail;

    private LocalDateTime createdAt;

    public PolicyDocumentEntity() {}
    
	public PolicyDocumentEntity(Long documentId, PolicyProposalEntity proposal, String documentUniqueId, DocumentType documentType,
			String filePath, String fileName, Status status, String sentToEmail, LocalDateTime createdAt) {
		super();
		this.documentId = documentId;
		this.proposal = proposal;
		this.documentUniqueId = documentUniqueId;
		this.documentType = documentType;
		this.filePath = filePath;
		this.fileName = fileName;
		this.status = status;
		this.sentToEmail = sentToEmail;
		this.createdAt = createdAt;
	}
	@Override
	public String toString() {
		return "PolicyDocument [documentId=" + documentId + ", proposal=" + proposal + ", documentUniqueId="
				+ documentUniqueId + ", filePath=" + filePath + ", fileName=" + fileName + ", sentToEmail="
				+ sentToEmail + "]";
	}
	public Long getDocumentId() {
		return documentId;
	}
	public void setDocumentId(Long documentId) {
		this.documentId = documentId;
	}
	public PolicyProposalEntity getProposal() {
		return proposal;
	}
	public void setProposal(PolicyProposalEntity proposal) {
		this.proposal = proposal;
	}
	public String getDocumentUniqueId() {
		return documentUniqueId;
	}
	public void setDocumentUniqueId(String documentUniqueId) {
		this.documentUniqueId = documentUniqueId;
	}
	public DocumentType getDocumentType() {
		return documentType;
	}
	public void setDocumentType(DocumentType documentType) {
		this.documentType = documentType;
	}
	public String getFilePath() {
		return filePath;
	}
	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}
	public String getFileName() {
		return fileName;
	}
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	public Status getStatus() {
		return status;
	}
	public void setStatus(Status status) {
		this.status = status;
	}
	public String getSentToEmail() {
		return sentToEmail;
	}
	public void setSentToEmail(String sentToEmail) {
		this.sentToEmail = sentToEmail;
	}
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	
	
	public enum Status {
	    GENERATED,
	    SENT,
	    DOWNLOADED
	}
	public enum DocumentType {
	    POLICY_CERTIFICATE,
	    QUOTE,
	    RECEIPT
	}
}
