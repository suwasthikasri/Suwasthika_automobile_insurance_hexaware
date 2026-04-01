package com.hexaware.spring_automobile.service.implementation;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.hexaware.spring_automobile.entity.OfficerActionEntity;
import com.hexaware.spring_automobile.pojo.OfficerAction;

@SpringBootTest
@Transactional
class OfficerActionServiceImplTest {

    @Autowired
    private OfficerActionServiceImpl officerActionService;

    @Test
    void testRecordAction() {
        OfficerAction action = new OfficerAction();
        action.setOldStatus("PENDING");
        action.setNewStatus("APPROVED");
        action.setComments("Verified documents");
        int result = officerActionService.recordAction(action);
        assertEquals(1, result);
    }

    @Test
    void testGetActionsByProposal() {
        OfficerAction action = new OfficerAction();
        action.setOldStatus("NEW");
        action.setNewStatus("REVIEWED");
        action.setComments("Test action");
        officerActionService.recordAction(action);
        List<OfficerActionEntity> result = officerActionService.getActionsByProposal(1L);

        assertNotNull(result);
    }
}