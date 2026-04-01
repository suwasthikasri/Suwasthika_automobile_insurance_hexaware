package com.hexaware.spring_automobile.service.interfaces;

import java.util.List;

import com.hexaware.spring_automobile.entity.OfficerActionEntity;
import com.hexaware.spring_automobile.pojo.OfficerAction;

public interface IOfficerActionService {

	int recordAction(OfficerAction action);

    List<OfficerActionEntity> getActionsByProposal(Long proposalId);
}
