package com.hexaware.spring_automobile.service.implementation;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.spring_automobile.entity.OfficerActionEntity;
import com.hexaware.spring_automobile.pojo.OfficerAction;
import com.hexaware.spring_automobile.repository.OfficerActionRepository;
import com.hexaware.spring_automobile.service.interfaces.IOfficerActionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@Service
public class OfficerActionServiceImpl implements IOfficerActionService {

    private static final Logger logger = LoggerFactory.getLogger(OfficerActionServiceImpl.class);

    @Autowired
    private OfficerActionRepository actionRepository;

    @Override
    public int recordAction(OfficerAction action) {

        logger.info("Recording officer action. Old Status: {}, New Status: {}", 
                     action.getOldStatus(), action.getNewStatus());

        OfficerActionEntity entity = new OfficerActionEntity();

        entity.setComments(action.getComments());
        entity.setOldStatus(action.getOldStatus());
        entity.setNewStatus(action.getNewStatus());
        entity.setCreatedAt(LocalDateTime.now());

        actionRepository.save(entity);

        logger.info("Officer action recorded successfully");

        return 1;
    }

    @Override
    public List<OfficerActionEntity> getActionsByProposal(Long proposalId) {

        logger.info("Fetching officer actions for proposal id: {}", proposalId);

        return actionRepository.getActionsByProposal(proposalId);
    }
}