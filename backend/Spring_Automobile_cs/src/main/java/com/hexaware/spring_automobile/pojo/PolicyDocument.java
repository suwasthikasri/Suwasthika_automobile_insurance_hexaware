package com.hexaware.spring_automobile.pojo;

import java.time.LocalDateTime;
import jakarta.validation.constraints.*;

public class PolicyDocument {
	private Long documentId;

	@NotNull(message = "Proposal must be provided")
	private PolicyProposal proposal;

	@NotBlank(message = "Document unique ID cannot be empty")
	private String documentUniqueId;

	@NotNull(message = "Document type must be selected")
	private DocumentType documentType;

	@NotBlank(message = "File path cannot be empty")
	private String filePath;

	@NotBlank(message = "File name cannot be empty")
	private String fileName;

	private Status status;

	@NotBlank(message = "Email address cannot be empty")
	@Email(message = "Invalid email format")
	private String sentToEmail;

	private LocalDateTime createdAt;
	public PolicyDocument() {}
	public PolicyDocument(Long documentId, PolicyProposal proposal, String documentUniqueId, DocumentType documentType,
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
	public PolicyProposal getProposal() {
		return proposal;
	}
	public void setProposal(PolicyProposal proposal) {
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
