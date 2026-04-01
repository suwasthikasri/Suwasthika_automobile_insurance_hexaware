package com.hexaware.spring_automobile.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.hexaware.spring_automobile.entity.InsurancePolicyEntity;

@Repository
public interface InsurancePolicyRepository extends JpaRepository<InsurancePolicyEntity, Long> {

    
    @Query(value="SELECT * FROM insurance_policies WHERE vehicle_category = ?1", nativeQuery=true)
    List<InsurancePolicyEntity> findPoliciesByVehicleCategory(String category);

}