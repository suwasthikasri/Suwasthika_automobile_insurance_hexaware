package com.hexaware.spring_automobile.service.implementation;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.hexaware.spring_automobile.entity.UserEntity;
import com.hexaware.spring_automobile.pojo.User;

@SpringBootTest
@Transactional
class UserServiceImplTest {

    @Autowired
    private UserServiceImpl userService;

    @Test
    void testRegisterUser() {
        User user = new User();
        user.setUsername("john");
        user.setEmail("john@gmail.com");
        user.setPasswordHash("12345");
        user.setFullName("John Doe");
        user.setAddress("Chennai");
        user.setPhoneNumber("9876543210");

        int result = userService.registerUser(user);

        assertEquals(1, result);
    }

    @Test
    void testLoginUserSuccess() {
        User user = new User();
        user.setEmail("login@gmail.com");
        user.setPasswordHash("pass123");
        userService.registerUser(user);

        UserEntity result = userService.loginUser("login@gmail.com", "pass123");

        assertNotNull(result);
        assertEquals("login@gmail.com", result.getEmail());
    }

    @Test
    void testGetUserById() {
        User user = new User();
        user.setEmail("find@gmail.com");
        userService.registerUser(user);

        List<UserEntity> users = userService.getAllUsers();
        Long id = users.get(users.size() - 1).getUserId();

        UserEntity result = userService.getUserById(id);

        assertNotNull(result);
        assertEquals(id, result.getUserId());
    }

    @Test
    void testGetAllUsers() {
        User u1 = new User();
        u1.setEmail("u1@gmail.com");
        User u2 = new User();
        u2.setEmail("u2@gmail.com");

        userService.registerUser(u1);
        userService.registerUser(u2);

        List<UserEntity> result = userService.getAllUsers();

        assertTrue(result.size() >= 2);
    }

    @Test
    void testUpdateUser() {
        User user = new User();
        user.setEmail("update@gmail.com");
        userService.registerUser(user);

        List<UserEntity> users = userService.getAllUsers();
        UserEntity existing = users.get(users.size() - 1);

        User updateDetails = new User();
        updateDetails.setUserId(existing.getUserId());
        updateDetails.setFullName("Updated Name");
        updateDetails.setAddress("New Address");
        updateDetails.setPhoneNumber("9999999999");

        int result = userService.updateUser(updateDetails);

        assertEquals(1, result);
        UserEntity updated = userService.getUserById(existing.getUserId());
        assertEquals("Updated Name", updated.getFullName());
    }
}