package com.hexaware.spring_automobile.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.hexaware.spring_automobile.entity.PolicyDocumentEntity;

@Repository
public interface PolicyDocumentRepository extends JpaRepository<PolicyDocumentEntity, Long> {

    @Query(value="SELECT * FROM policy_documents WHERE proposal_id = ?1", nativeQuery=true)
    PolicyDocumentEntity findByProposalId(Long proposalId);

    @Query(value="SELECT * FROM policy_documents pd JOIN policy_proposals pp ON pd.proposal_id = pp.proposal_id WHERE pp.user_id = ?1", nativeQuery=true)
    List<PolicyDocumentEntity> findDocumentsByUser(Long userId);

}