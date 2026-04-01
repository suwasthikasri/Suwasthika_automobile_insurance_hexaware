package com.hexaware.spring_automobile.entity;

import java.math.BigDecimal;
import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
@Entity
@Table(name="claims")

@NamedQuery(
name="ClaimEntity.findClaimsByStatus",
query="SELECT c FROM ClaimEntity c WHERE c.claimStatus = :status"
)

@NamedQuery(
name="ClaimEntity.findClaimsByUser",
query="SELECT c FROM ClaimEntity c WHERE c.proposal.userEntity.userId = :userId"
)

public class ClaimEntity 
{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long claimId;

	@ManyToOne
	@JoinColumn(name="proposal_id")
	 @JsonIgnoreProperties({"claims", "userEntity", "hibernateLazyInitializer", "handler"})
	private PolicyProposalEntity proposal;

	@Column(name="claim_reference")
	private String claimReference;

	@Column(name="claim_reason")
	private String claimReason;

	@Column(name="claim_amount")
	private BigDecimal claimAmount;

	@Enumerated(EnumType.STRING)
	@Column(name="claim_status")
	private ClaimStatus claimStatus;

	@Column(name="officer_comments")
	private String officerComments;

	@Column(name="created_at")
	private LocalDateTime createdAt;

	@Column(name="updated_at")
	private LocalDateTime updatedAt;
	public ClaimEntity () {}
	
	
	
	
	
	
	public ClaimEntity(Long claimId, PolicyProposalEntity proposal, String claimReference, String claimReason,
			BigDecimal claimAmount, ClaimStatus claimStatus, String officerComments, LocalDateTime createdAt,
			LocalDateTime updatedAt) {
		super();
		this.claimId = claimId;
		this.proposal = proposal;
		this.claimReference = claimReference;
		this.claimReason = claimReason;
		this.claimAmount = claimAmount;
		this.claimStatus = claimStatus;
		this.officerComments = officerComments;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}






	public Long getClaimId() {
		return claimId;
	}






	public void setClaimId(Long claimId) {
		this.claimId = claimId;
	}






	public PolicyProposalEntity getProposal() {
		return proposal;
	}






	public void setProposal(PolicyProposalEntity proposal) {
		this.proposal = proposal;
	}






	public String getClaimReference() {
		return claimReference;
	}






	public void setClaimReference(String claimReference) {
		this.claimReference = claimReference;
	}






	public String getClaimReason() {
		return claimReason;
	}






	public void setClaimReason(String claimReason) {
		this.claimReason = claimReason;
	}






	public BigDecimal getClaimAmount() {
		return claimAmount;
	}






	public void setClaimAmount(BigDecimal claimAmount) {
		this.claimAmount = claimAmount;
	}






	public ClaimStatus getClaimStatus() {
		return claimStatus;
	}






	public void setClaimStatus(ClaimStatus claimStatus) {
		this.claimStatus = claimStatus;
	}






	public String getOfficerComments() {
		return officerComments;
	}






	public void setOfficerComments(String officerComments) {
		this.officerComments = officerComments;
	}






	public LocalDateTime getCreatedAt() {
		return createdAt;
	}






	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}






	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}






	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}






	@Override
	public String toString() {
		return "Claim [claimId=" + claimId + ", proposal=" + proposal + ", claimReference=" + claimReference
				+ ", claimReason=" + claimReason + ", claimAmount=" + claimAmount + ", claimStatus=" + claimStatus
				+ ", officerComments=" + officerComments + ", createdAt=" + createdAt + ", updatedAt=" + updatedAt
				+ "]";
	}






	public enum ClaimStatus {

	    INITIATED,
	    UNDER_REVIEW,
	    APPROVED,
	    REJECTED,
	    PAID
	}
	
}
