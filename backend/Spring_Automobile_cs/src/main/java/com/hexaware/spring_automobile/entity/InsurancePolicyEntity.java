package com.hexaware.spring_automobile.entity;


import java.time.LocalDateTime;
import jakarta.persistence.*;


@Entity
@Table(name="insurance_policies")

@NamedQuery(
name="InsurancePolicyEntity.findPoliciesByVehicleCategory",
query="SELECT p FROM InsurancePolicyEntity p WHERE p.vehicleCategory = :category"
)

public class InsurancePolicyEntity {
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long policyId;

	    @Column(name="policy_name")
	    private String policyName;

	    @Enumerated(EnumType.STRING)
	    @Column(name="vehicle_category")
	    private VehicleCategory vehicleCategory;

	    private String description;

	    @Column(name="base_premium")
	    private Double basePremium;

	    @Column(name="coverage_details")
	    private String coverageDetails;

	    private String addOns;

	    @Column(name="is_active")
	    private Boolean isActive;

	    @Column(name="created_at")
	    private LocalDateTime createdAt;

	    @Column(name="updated_at")
	    private LocalDateTime updatedAt;

	public enum VehicleCategory {
	    CAR,
	    BIKE,
	    TRUCK,
	    CAMPER_VAN
	}
	public InsurancePolicyEntity() {}
	
	public InsurancePolicyEntity(Long policyId, String policyName, VehicleCategory vehicleCategory, String description,
			Double basePremium, String coverageDetails, String addOns, Boolean isActive, LocalDateTime createdAt,
			LocalDateTime updatedAt) {
		super();
		this.policyId = policyId;
		this.policyName = policyName;
		this.vehicleCategory = vehicleCategory;
		this.description = description;
		this.basePremium = basePremium;
		this.coverageDetails = coverageDetails;
		this.addOns = addOns;
		this.isActive = isActive;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}
	
	public Long getPolicyId() {
		return policyId;
	}
	public void setPolicyId(Long policyId) {
		this.policyId = policyId;
	}
	public String getPolicyName() {
		return policyName;
	}
	public void setPolicyName(String policyName) {
		this.policyName = policyName;
	}
	public VehicleCategory getVehicleCategory() {
		return vehicleCategory;
	}
	public void setVehicleCategory(VehicleCategory vehicleCategory) {
		this.vehicleCategory = vehicleCategory;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Double getBasePremium() {
		return basePremium;
	}
	public void setBasePremium(Double basePremium) {
		this.basePremium = basePremium;
	}
	public String getCoverageDetails() {
		return coverageDetails;
	}
	public void setCoverageDetails(String coverageDetails) {
		this.coverageDetails = coverageDetails;
	}
	public String getAddOns() {
		return addOns;
	}
	public void setAddOns(String addOns) {
		this.addOns = addOns;
	}
	public Boolean getIsActive() {
		return isActive;
	}
	public void setIsActive(Boolean isActive) {
		this.isActive = isActive;
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
		return "InsurancePolicy [policyId=" + policyId + ", policyName=" + policyName + ", description=" + description
				+ ", basePremium=" + basePremium + ", coverageDetails=" + coverageDetails + ", addOns=" + addOns
				+ ", isActive=" + isActive + "]";
	}
	
	
}
