package com.hexaware.spring_automobile.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.hexaware.spring_automobile.entity.OfficerActionEntity;

@Repository
public interface OfficerActionRepository extends JpaRepository<OfficerActionEntity, Long> {

    @Query(value="SELECT * FROM officer_actions WHERE proposal_id = ?1", nativeQuery=true)
    List<OfficerActionEntity> getActionsByProposal(Long proposalId);

}