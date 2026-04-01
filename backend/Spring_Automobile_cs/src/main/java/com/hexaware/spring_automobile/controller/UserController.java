package com.hexaware.spring_automobile.controller;

import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.hexaware.spring_automobile.config.JwtUtil;
import com.hexaware.spring_automobile.entity.UserEntity;
import com.hexaware.spring_automobile.pojo.LoginRequest;
import com.hexaware.spring_automobile.pojo.User;
import com.hexaware.spring_automobile.service.interfaces.IUserService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    private IUserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public int registerUser(@RequestBody User user) {
        return userService.registerUser(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {

        System.out.println("DEBUG: Login request received for: " + loginRequest.getEmail());

        try {
            
            UserEntity user = userService.loginUser(
                loginRequest.getEmail(),
                loginRequest.getPassword()
            );
            System.out.println("DEBUG: Authentication passed. Role = " + user.getRole());

           
            if (user.getRole() == null) {
                System.err.println("❌ NULL ROLE for user: " + loginRequest.getEmail());
                return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "User has no assigned role"));
            }

            
            String token = jwtUtil.generateToken(
                loginRequest.getEmail(),
                user.getRole().name()
            );
            System.out.println("DEBUG: Token generated: " + token.substring(0, 20) + "...");

            
            return ResponseEntity.ok(token);

        } catch (RuntimeException e) {
           
            System.out.print("login crash");
            
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid email or password"));
        }
    }
    @PreAuthorize("hasAnyRole('USER','OFFICER')")
    @GetMapping("/{userId}")
    public UserEntity getUserById(@PathVariable Long userId) {
        return userService.getUserById(userId);
    }

    @PreAuthorize("hasRole('OFFICER')")
    @GetMapping("/all")
    public List<UserEntity> getAllUsers() {
        return userService.getAllUsers();
    }

    @PreAuthorize("hasAnyRole('USER','OFFICER')")
    @PutMapping("/update")
    public int updateUser(@Valid @RequestBody User user) {
        return userService.updateUser(user);
    }

   
    @PreAuthorize("hasAnyRole('USER','OFFICER')")
    @GetMapping("/email/{email}")
    public UserEntity findUserByEmail(@PathVariable String email) {
        return userService.findUserByEmail(email);
    }
}