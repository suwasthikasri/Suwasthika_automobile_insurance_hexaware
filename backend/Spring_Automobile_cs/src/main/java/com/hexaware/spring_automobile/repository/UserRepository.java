package com.hexaware.spring_automobile.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.hexaware.spring_automobile.entity.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

	UserEntity findByEmail(String email);
	
    @Query(value="SELECT * FROM users WHERE email = ?1", nativeQuery=true)
    UserEntity findUserByEmail(String email);

}