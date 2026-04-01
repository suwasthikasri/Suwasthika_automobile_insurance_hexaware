package com.hexaware.spring_automobile.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;


import jakarta.persistence.*;


@Entity
@Table(name="users")

@NamedQuery(
name="UserEntity.findUserByEmail",
query="SELECT u FROM UserEntity u WHERE u.email = :email"
)
public class UserEntity {
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long userId;

	    private String username;

	    @Column(unique = true)
	    private String email;

	    private String passwordHash;

	    private String fullName;

	    private LocalDate dateOfBirth;

	    private String aadhaarNumber;

	    private String panNumber;

	    private String address;

	    private String phoneNumber;

	    @Enumerated(EnumType.STRING)   // ✅ MUST HAVE — sends "USER" not 0
	    @Column(name = "role")
	    private Role role;

	    private Boolean isActive;

	    private LocalDateTime createdAt;

	    private LocalDateTime updatedAt;

	    public UserEntity() {}
	
	public UserEntity(Long userId, String username, String email, String passwordHash, String fullName, LocalDate dateOfBirth,
			String aadhaarNumber, String panNumber, String address, String phoneNumber, Role role, Boolean isActive,
			LocalDateTime createdAt, LocalDateTime updatedAt) {
		super();
		this.userId = userId;
		this.username = username;
		this.email = email;
		this.passwordHash = passwordHash;
		this.fullName = fullName;
		this.dateOfBirth = dateOfBirth;
		this.aadhaarNumber = aadhaarNumber;
		this.panNumber = panNumber;
		this.address = address;
		this.phoneNumber = phoneNumber;
		this.role = role;
		this.isActive = isActive;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}
	public Long getUserId() {
		return userId;
	}
	public void setUserId(Long userId) {
		this.userId = userId;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPasswordHash() {
		return passwordHash;
	}
	public void setPasswordHash(String passwordHash) {
		this.passwordHash = passwordHash;
	}
	public String getFullName() {
		return fullName;
	}
	public void setFullName(String fullName) {
		this.fullName = fullName;
	}
	public LocalDate getDateOfBirth() {
		return dateOfBirth;
	}
	public void setDateOfBirth(LocalDate dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}
	public String getAadhaarNumber() {
		return aadhaarNumber;
	}
	public void setAadhaarNumber(String aadhaarNumber) {
		this.aadhaarNumber = aadhaarNumber;
	}
	public String getPanNumber() {
		return panNumber;
	}
	public void setPanNumber(String panNumber) {
		this.panNumber = panNumber;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getPhoneNumber() {
		return phoneNumber;
	}
	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}
	public Role getRole() {
		return role;
	}
	public void setRole(Role role) {
		this.role = role;
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
		return "User [userId=" + userId + ", username=" + username + ", email=" + email + ", passwordHash="
				+ passwordHash + ", fullName=" + fullName + ", aadhaarNumber=" + aadhaarNumber + ", panNumber="
				+ panNumber + ", address=" + address + ", phoneNumber=" + phoneNumber + ", isActive=" + isActive + "]";
	}
	
	public enum Role {
	    USER,
	    OFFICER
	}

}
