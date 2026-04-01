package com.hexaware.spring_automobile.service.interfaces;

import java.util.List;


import com.hexaware.spring_automobile.entity.UserEntity;
import com.hexaware.spring_automobile.pojo.User;
public interface IUserService {
	 int registerUser(User user);

	    UserEntity loginUser(String email, String password);

	    UserEntity getUserById(Long userId);

	    List<UserEntity> getAllUsers();

	    int updateUser(User user);
	    
	    UserEntity findUserByEmail(String email);


}
