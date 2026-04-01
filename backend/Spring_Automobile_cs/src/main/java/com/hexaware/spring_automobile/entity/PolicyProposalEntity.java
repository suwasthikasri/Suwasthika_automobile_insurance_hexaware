package com.hexaware.spring_automobile.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;


@Entity
@Table(name="policy_proposals")

@NamedQuery(
name="PolicyProposalEntity.findProposalsByStatus",
query="SELECT p FROM PolicyProposalEntity p WHERE p.status = :status"
)

@NamedQuery(
name="PolicyProposalEntity.findByUserId",
query="SELECT p FROM PolicyProposalEntity p WHERE p.userEntity.userId = :userId"
)
public class PolicyProposalEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long proposalId;

    @ManyToOne
    @JoinColumn(name="user_id")
    @JsonIgnoreProperties({"proposals", "password", "passwordHash", 
        "hibernateLazyInitializer", "handler"})
    private UserEntity userEntity;

    @ManyToOne
    @JoinColumn(name="policy_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private InsurancePolicyEntity policy;

    private String proposalUniqueId;
    private String vehicleMake;
    private String vehicleModel;
    private Integer vehicleYear;
    private String registrationNumber;
    private String chassisNumber;
    private String engineNumber;
    private Double vehicleValue;
    private String selectedAddOns;

    @Enumerated(EnumType.STRING)
    private Status status;

    private Double quoteAmount;
    private String additionalInfoRequested;
    private String documentsSubmitted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime expiresAt;
    
	public PolicyProposalEntity(Long proposalId, UserEntity userEntity, InsurancePolicyEntity policy, String proposalUniqueId,
			String vehicleMake, String vehicleModel, Integer vehicleYear, String registrationNumber,
			String chassisNumber, String engineNumber, Double vehicleValue, String selectedAddOns, Status status,
			Double quoteAmount, String additionalInfoRequested, String documentsSubmitted, LocalDateTime createdAt,
			LocalDateTime updatedAt, LocalDateTime expiresAt) {
		super();
		this.proposalId = proposalId;
		this.userEntity = userEntity;
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
	public PolicyProposalEntity() {}
	
	
	
	public Long getProposalId() {
		return proposalId;
	}



	public void setProposalId(Long proposalId) {
		this.proposalId = proposalId;
	}



	public UserEntity getUserEntity() {
	    return userEntity;
	}
	public void setUserEntity(UserEntity userEntity) {
	    this.userEntity = userEntity;
	}



	public InsurancePolicyEntity getPolicy() {
		return policy;
	}



	public void setPolicy(InsurancePolicyEntity policy) {
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
		return "PolicyProposal [proposalId=" + proposalId + ", user=" + userEntity + ", policy=" + policy
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
