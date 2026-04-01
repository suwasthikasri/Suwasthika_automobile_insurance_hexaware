package com.hexaware.spring_automobile.service.implementation;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.spring_automobile.entity.UserEntity;
import com.hexaware.spring_automobile.entity.UserEntity.Role;
import com.hexaware.spring_automobile.exception.ResourceNotFoundException;
import com.hexaware.spring_automobile.pojo.User;
import com.hexaware.spring_automobile.repository.UserRepository;
import com.hexaware.spring_automobile.service.interfaces.IUserService;

@Service
public class UserServiceImpl implements IUserService {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    @Autowired
    private UserRepository userRepository;

    @Override
    public int registerUser(User user) {

        logger.info("Registering user with email: {}", user.getEmail());

        UserEntity entity = new UserEntity();

        entity.setUsername(user.getUsername());
        entity.setEmail(user.getEmail());
        entity.setPasswordHash(user.getPasswordHash());
        entity.setFullName(user.getFullName());
        entity.setAddress(user.getAddress());
        entity.setPhoneNumber(user.getPhoneNumber());
        entity.setRole(Role.USER);
        userRepository.save(entity);

        logger.info("User registered successfully with email: {}", user.getEmail());

        return 1;
    }

    @Override
    public UserEntity loginUser(String email, String password) {

        logger.info("User login attempt with email: {}", email);

        UserEntity user = userRepository.findByEmail(email);

        if(user != null && user.getPasswordHash().equals(password)) {

            logger.info("Login successful for user: {}", email);
            return user;
        }

        logger.warn("Login failed for email: {}", email);

        throw new RuntimeException("Invalid email or password");
    }

    @Override
    public UserEntity getUserById(Long userId) {

        logger.info("Fetching user with id: {}", userId);

        return userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.error("User not found with id: {}", userId);
                    return new ResourceNotFoundException("User not found");
                });
    }

    @Override
    public List<UserEntity> getAllUsers() {

        logger.info("Fetching all users");

        return userRepository.findAll();
    }

    @Override
    public int updateUser(User user) {

        logger.info("Updating user with id: {}", user.getUserId());

        UserEntity entity = userRepository.findById(user.getUserId())
                .orElseThrow(() -> {
                    logger.error("User not found with id: {}", user.getUserId());
                    return new ResourceNotFoundException("User not found");
                });

        entity.setFullName(user.getFullName());
        entity.setAddress(user.getAddress());
        entity.setPhoneNumber(user.getPhoneNumber());

        userRepository.save(entity);

        logger.info("User updated successfully with id: {}", user.getUserId());

        return 1;
    }

    @Override
    public UserEntity findUserByEmail(String email) {

        logger.info("Fetching user by email: {}", email);

        return userRepository.findUserByEmail(email);
    }
}