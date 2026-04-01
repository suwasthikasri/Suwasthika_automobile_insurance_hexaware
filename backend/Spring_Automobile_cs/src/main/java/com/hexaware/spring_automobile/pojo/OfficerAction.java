package com.hexaware.spring_automobile.pojo;

import java.time.LocalDateTime;
import jakarta.validation.constraints.*;
public class OfficerAction {
	private Long actionId;
	@NotNull(message = "Officer must be provided")
	private User officer;

	@NotNull(message = "Proposal must be provided")
	private PolicyProposal proposal;

	@NotNull(message = "Action type must be selected")
	private ActionType actionType;

	@NotBlank(message = "Comments cannot be empty")
	private String comments; String oldStatus;
	private String newStatus;
	private LocalDateTime createdAt;
	
	public OfficerAction() {}
	
	public OfficerAction(Long actionId, User officer, PolicyProposal proposal, ActionType actionType, String comments,
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
	public User getOfficer() {
		return officer;
	}
	public void setOfficer(User officer) {
		this.officer = officer;
	}
	public PolicyProposal getProposal() {
		return proposal;
	}
	public void setProposal(PolicyProposal proposal) {
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
