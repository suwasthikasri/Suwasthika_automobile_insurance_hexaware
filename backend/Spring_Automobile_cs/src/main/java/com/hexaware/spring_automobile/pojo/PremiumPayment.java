package com.hexaware.spring_automobile.pojo;

import java.time.LocalDateTime;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Pattern;

public class PremiumPayment 
{
	private Long paymentId;

    @NotNull(message = "Proposal must be provided for payment")
    private PolicyProposal proposal;

    @NotBlank(message = "Payment reference cannot be empty")
    private String paymentReference;

    @NotNull(message = "Payment amount is required")
    @Positive(message = "Payment amount must be greater than zero")
    private Double amount;

    private PaymentStatus paymentStatus;

    @NotNull(message = "Payment method must be selected")
    private PaymentMethod paymentMethod;

    @NotBlank(message = "Transaction ID cannot be empty")
    @Pattern(regexp = "^[A-Z0-9]{6,20}$",
             message = "Transaction ID must contain 6–20 uppercase letters or numbers")
    private String transactionId;

    private LocalDateTime paidAt;

    private LocalDateTime createdAt;

	public PremiumPayment() {}
	public PremiumPayment(Long paymentId, PolicyProposal proposal, String paymentReference, Double amount,
			PaymentStatus paymentStatus, PaymentMethod paymentMethod, String transactionId, LocalDateTime paidAt,
			LocalDateTime createdAt) {
		super();
		this.paymentId = paymentId;
		this.proposal = proposal;
		this.paymentReference = paymentReference;
		this.amount = amount;
		this.paymentStatus = paymentStatus;
		this.paymentMethod = paymentMethod;
		this.transactionId = transactionId;
		this.paidAt = paidAt;
		this.createdAt = createdAt;
	}
	public Long getPaymentId() {
		return paymentId;
	}
	public void setPaymentId(Long paymentId) {
		this.paymentId = paymentId;
	}
	public PolicyProposal getProposal() {
		return proposal;
	}
	public void setProposal(PolicyProposal proposal) {
		this.proposal = proposal;
	}
	public String getPaymentReference() {
		return paymentReference;
	}
	public void setPaymentReference(String paymentReference) {
		this.paymentReference = paymentReference;
	}
	public Double getAmount() {
		return amount;
	}
	public void setAmount(Double amount) {
		this.amount = amount;
	}
	public PaymentStatus getPaymentStatus() {
		return paymentStatus;
	}
	public void setPaymentStatus(PaymentStatus paymentStatus) {
		this.paymentStatus = paymentStatus;
	}
	public PaymentMethod getPaymentMethod() {
		return paymentMethod;
	}
	public void setPaymentMethod(PaymentMethod paymentMethod) {
		this.paymentMethod = paymentMethod;
	}
	public String getTransactionId() {
		return transactionId;
	}
	public void setTransactionId(String transactionId) {
		this.transactionId = transactionId;
	}
	public LocalDateTime getPaidAt() {
		return paidAt;
	}
	public void setPaidAt(LocalDateTime paidAt) {
		this.paidAt = paidAt;
	}
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	@Override
	public String toString() {
		return "PremiumPayment [paymentId=" + paymentId + ", proposal=" + proposal + ", paymentReference="
				+ paymentReference + ", amount=" + amount + ", transactionId=" + transactionId + "]";
	}
	public enum PaymentStatus {
        PENDING,
        COMPLETED,
        FAILED,
        REFUNDED
    }

    public enum PaymentMethod {
        CARD,
        UPI,
        NET_BANKING,
        WALLET
    }
	
	
}
