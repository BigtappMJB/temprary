package com.example.auto.controller;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.auto.entity.User;



public interface UserRepositoryJWT extends JpaRepository<User, Long> {
	User findByEmail(String email);
}
