package com.hexaware.spring_automobile.pojo;

import java.time.LocalDateTime;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

public class PolicyProposal 
{
    private Long proposalId;
	
    
    private User user;

    @NotNull(message = "Policy must be selected")
    private InsurancePolicy policy;

    private String proposalUniqueId;

    @NotBlank(message = "Vehicle make cannot be empty")
    @Size(min = 2, max = 50, message = "Vehicle make must be between 2 and 50 characters")
    private String vehicleMake;

    @NotBlank(message = "Vehicle model cannot be empty")
    @Size(min = 2, max = 50, message = "Vehicle model must be between 2 and 50 characters")
    private String vehicleModel;

    @NotNull(message = "Vehicle year is required")
    @Min(value = 1990, message = "Vehicle year must be after 1990")
    @Max(value = 2100, message = "Vehicle year must be valid")
    private Integer vehicleYear;

    @NotBlank(message = "Registration number cannot be empty")
    @Pattern(regexp = "^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$",
            message = "Registration number must be in format TN47AB1234")
    private String registrationNumber;

    @NotBlank(message = "Chassis number is required")
    @Size(min = 5, max = 30, message = "Chassis number must be between 5 and 30 characters")
    private String chassisNumber;

    @NotBlank(message = "Engine number is required")
    @Size(min = 5, max = 30, message = "Engine number must be between 5 and 30 characters")
    private String engineNumber;

    @NotNull(message = "Vehicle value must be provided")
    @Positive(message = "Vehicle value must be greater than zero")
    private Double vehicleValue;

    private String selectedAddOns;

    private Status status;

    private Double quoteAmount;

    private String additionalInfoRequested;

    private String documentsSubmitted;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime expiresAt;
	
	public PolicyProposal() {}
	
	public PolicyProposal(Long proposalId, User user, InsurancePolicy policy, String proposalUniqueId,
			String vehicleMake, String vehicleModel, Integer vehicleYear, String registrationNumber,
			String chassisNumber, String engineNumber, Double vehicleValue, String selectedAddOns, Status status,
			Double quoteAmount, String additionalInfoRequested, String documentsSubmitted, LocalDateTime createdAt,
			LocalDateTime updatedAt, LocalDateTime expiresAt) {
		super();
		this.proposalId = proposalId;
		this.user = user;
		this.policy = policy;
		this.proposalUniqueId = proposalUniqueId;
		this.vehicleMake = vehicleMake;
		this.vehicleModel = vehicleModel;
		this.vehicleYear = vehicleYear;
		this.registrationNumber = registrationNumber;
		this.chassisNumber = chassisNumber;
		this.engineNumber = engineNumber;
		this.vehicleValue = vehicleValue;
		this.selectedAddOns = selectedAddOns;
		this.status = status;
		this.quoteAmount = quoteAmount;
		this.additionalInfoRequested = additionalInfoRequested;
		this.documentsSubmitted = documentsSubmitted;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.expiresAt = expiresAt;
		
		
		
	}
	
	
	
	public Long getProposalId() {
		return proposalId;
	}



	public void setProposalId(Long proposalId) {
		this.proposalId = proposalId;
	}



	public User getUser() {
		return user;
	}



	public void setUser(User user) {
		this.user = user;
	}



	public InsurancePolicy getPolicy() {
		return policy;
	}



	public void setPolicy(InsurancePolicy policy) {
		this.policy = policy;
	}



	public String getProposalUniqueId() {
		return proposalUniqueId;
	}



	public void setProposalUniqueId(String proposalUniqueId) {
		this.proposalUniqueId = proposalUniqueId;
	}



	public String getVehicleMake() {
		return vehicleMake;
	}



	public void setVehicleMake(String vehicleMake) {
		this.vehicleMake = vehicleMake;
	}



	public String getVehicleModel() {
		return vehicleModel;
	}



	public void setVehicleModel(String vehicleModel) {
		this.vehicleModel = vehicleModel;
	}



	public Integer getVehicleYear() {
		return vehicleYear;
	}



	public void setVehicleYear(Integer vehicleYear) {
		this.vehicleYear = vehicleYear;
	}



	public String getRegistrationNumber() {
		return registrationNumber;
	}



	public void setRegistrationNumber(String registrationNumber) {
		this.registrationNumber = registrationNumber;
	}



	public String getChassisNumber() {
		return chassisNumber;
	}



	public void setChassisNumber(String chassisNumber) {
		this.chassisNumber = chassisNumber;
	}



	public String getEngineNumber() {
		return engineNumber;
	}



	public void setEngineNumber(String engineNumber) {
		this.engineNumber = engineNumber;
	}



	public Double getVehicleValue() {
		return vehicleValue;
	}



	public void setVehicleValue(Double vehicleValue) {
		this.vehicleValue = vehicleValue;
	}



	public String getSelectedAddOns() {
		return selectedAddOns;
	}



	public void setSelectedAddOns(String selectedAddOns) {
		this.selectedAddOns = selectedAddOns;
	}



	public Status getStatus() {
		return status;
	}



	public void setStatus(Status status) {
		this.status = status;
	}



	public Double getQuoteAmount() {
		return quoteAmount;
	}



	public void setQuoteAmount(Double quoteAmount) {
		this.quoteAmount = quoteAmount;
	}



	public String getAdditionalInfoRequested() {
		return additionalInfoRequested;
	}



	public void setAdditionalInfoRequested(String additionalInfoRequested) {
		this.additionalInfoRequested = additionalInfoRequested;
	}



	public String getDocumentsSubmitted() {
		return documentsSubmitted;
	}



	public void setDocumentsSubmitted(String documentsSubmitted) {
		this.documentsSubmitted = documentsSubmitted;
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



	public LocalDateTime getExpiresAt() {
		return expiresAt;
	}



	public void setExpiresAt(LocalDateTime expiresAt) {
		this.expiresAt = expiresAt;
	}



	@Override
	public String toString() {
		return "PolicyProposal [proposalId=" + proposalId + ", user=" + user + ", policy=" + policy
				+ ", proposalUniqueId=" + proposalUniqueId + ", vehicleMake=" + vehicleMake + ", vehicleModel="
				+ vehicleModel + ", vehicleYear=" + vehicleYear + ", registrationNumber=" + registrationNumber
				+ ", chassisNumber=" + chassisNumber + ", engineNumber=" + engineNumber + ", vehicleValue="
				+ vehicleValue + ", selectedAddOns=" + selectedAddOns + ", quoteAmount=" + quoteAmount
				+ ", additionalInfoRequested=" + additionalInfoRequested + ", documentsSubmitted=" + documentsSubmitted
				+ "]";
	}
	public enum Status {
	    GENERATED,
	    SENT,
	    DOWNLOADED,
	    ACTIVE,
	    REJECTED,
	    EXPIRED
	}
	
	

}
