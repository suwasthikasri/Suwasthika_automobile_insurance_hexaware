package com.hexaware.spring_automobile.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.hexaware.spring_automobile.entity.EmailNotificationEntity;

@Repository
public interface EmailNotificationRepository extends JpaRepository<EmailNotificationEntity, Long> {

    @Query(value = "SELECT * FROM email_notifications WHERE proposal_id = ?1", nativeQuery = true)
    List<EmailNotificationEntity> findEmailsByProposal(Long proposalId);

    @Query(value = "SELECT * FROM email_notifications WHERE user_id = ?1", nativeQuery = true)
    List<EmailNotificationEntity> findEmailsByUser(Long userId);

   
}