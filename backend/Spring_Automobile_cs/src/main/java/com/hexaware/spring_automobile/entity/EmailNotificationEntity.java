package com.hexaware.spring_automobile.entity;

import java.time.LocalDateTime;


import jakarta.persistence.*;


@Entity
@Table(name = "email_notifications")

public class EmailNotificationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificationId;

    @ManyToOne
    @JoinColumn(name = "proposal_id")
    private PolicyProposalEntity proposal;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity userEntity;

    @Enumerated(EnumType.STRING)
    @Column(name = "email_type")
    private EmailType emailType;

    @Column(name = "recipient_email")
    private String recipientEmail;

    private String subject;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public EmailNotificationEntity() {
    }

    
	
	public EmailNotificationEntity(Long notificationId, PolicyProposalEntity proposal, UserEntity userEntity, EmailType emailType,
			String recipientEmail, String subject, Status status, LocalDateTime sentAt, LocalDateTime createdAt) {
		super();
		this.notificationId = notificationId;
		this.proposal = proposal;
		this.userEntity = userEntity;
		this.emailType = emailType;
		this.recipientEmail = recipientEmail;
		this.subject = subject;
		this.status = status;
		this.sentAt = sentAt;
		this.createdAt = createdAt;
	}
	@Override
	public String toString() {
		return "EmailNotification [notificationId=" + notificationId + ", proposal=" + proposal + ", user=" + userEntity
				+ ", recipientEmail=" + recipientEmail + ", subject=" + subject + "]";
	}
	public Long getNotificationId() {
		return notificationId;
	}
	public void setNotificationId(Long notificationId) {
		this.notificationId = notificationId;
	}
	public PolicyProposalEntity getProposal() {
		return proposal;
	}
	public void setProposal(PolicyProposalEntity proposal) {
		this.proposal = proposal;
	}
	public UserEntity getUser() {
		return userEntity;
	}
	public void setUser(UserEntity userEntity) {
		this.userEntity = userEntity;
	}
	public EmailType getEmailType() {
		return emailType;
	}
	public void setEmailType(EmailType emailType) {
		this.emailType = emailType;
	}
	public String getRecipientEmail() {
		return recipientEmail;
	}
	public void setRecipientEmail(String recipientEmail) {
		this.recipientEmail = recipientEmail;
	}
	public String getSubject() {
		return subject;
	}
	public void setSubject(String subject) {
		this.subject = subject;
	}
	public Status getStatus() {
		return status;
	}
	public void setStatus(Status status) {
		this.status = status;
	}
	public LocalDateTime getSentAt() {
		return sentAt;
	}
	public void setSentAt(LocalDateTime sentAt) {
		this.sentAt = sentAt;
	}
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	public enum EmailType {
        QUOTE_SENT,
        POLICY_ISSUED,
        PREMIUM_REMINDER,
        ADDITIONAL_INFO_REQUEST,
        STATUS_UPDATE
    }

    public enum Status {
        SENT,
        FAILED,
        PENDING
    }
	
	
}
