package com.hexaware.spring_automobile.entity;

import java.time.LocalDateTime;


import jakarta.persistence.*;


@Entity
@Table(name="officer_actions")

@NamedQuery(
name="OfficerActionEntity.findActionsByProposal",
query="SELECT o FROM OfficerActionEntity o WHERE o.proposal.proposalId = :proposalId"
)
public class OfficerActionEntity {
	

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long actionId;

    @ManyToOne
    @JoinColumn(name="officer_id")
    private UserEntity officer;

    @ManyToOne
    @JoinColumn(name="proposal_id")
    private PolicyProposalEntity proposal;

    @Enumerated(EnumType.STRING)
    private ActionType actionType;

    private String comments;

    private String oldStatus;

    private String newStatus;

    private LocalDateTime createdAt;
    public OfficerActionEntity() {}
	public OfficerActionEntity(Long actionId, UserEntity officer, PolicyProposalEntity proposal, ActionType actionType, String comments,
			String oldStatus, String newStatus, LocalDateTime createdAt) {
		super();
		this.actionId = actionId;
		this.officer = officer;
		this.proposal = proposal;
		this.actionType = actionType;
		this.comments = comments;
		this.oldStatus = oldStatus;
		this.newStatus = newStatus;
		this.createdAt = createdAt;
	}
	public Long getActionId() {
		return actionId;
	}
	public void setActionId(Long actionId) {
		this.actionId = actionId;
	}
	public UserEntity getOfficer() {
		return officer;
	}
	public void setOfficer(UserEntity officer) {
		this.officer = officer;
	}
	public PolicyProposalEntity getProposal() {
		return proposal;
	}
	public void setProposal(PolicyProposalEntity proposal) {
		this.proposal = proposal;
	}
	public ActionType getActionType() {
		return actionType;
	}
	public void setActionType(ActionType actionType) {
		this.actionType = actionType;
	}
	public String getComments() {
		return comments;
	}
	public void setComments(String comments) {
		this.comments = comments;
	}
	public String getOldStatus() {
		return oldStatus;
	}
	public void setOldStatus(String oldStatus) {
		this.oldStatus = oldStatus;
	}
	public String getNewStatus() {
		return newStatus;
	}
	public void setNewStatus(String newStatus) {
		this.newStatus = newStatus;
	}
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	@Override
	public String toString() {
		return "OfficerAction [actionId=" + actionId + ", officer=" + officer + ", proposal=" + proposal + ", comments="
				+ comments + ", oldStatus=" + oldStatus + ", newStatus=" + newStatus + "]";
	}
	public enum ActionType {
	    REVIEWED,
	    REQUESTED_INFO,
	    QUOTE_GENERATED,
	    APPROVED,
	    REJECTED,
	    STATUS_CHANGED
	}
	
	
}
