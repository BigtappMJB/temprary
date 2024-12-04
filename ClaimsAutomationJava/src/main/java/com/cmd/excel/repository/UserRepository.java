package com.cmd.excel.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.cmd.excel.model.Users;
/**
 * @author ISV7915
 *
 */
public interface UserRepository extends JpaRepository<Users, Integer> {

	@Query(value="select * from users usr where usr.user_name = :userName", nativeQuery=true) 
	Users findUserByUserId(@Param("userName") String userName);
	
	Users findUserById(int id);
	
	@Query(value="select count(*) FROM users usr where usr.user_name = :userName", nativeQuery=true) 
	int findByUserId(@Param("userName") String userName);
	
	@Query(value="select * from users usr  where usr.delete_flag = 0 ORDER BY id DESC ", nativeQuery=true) 
	List<Users> getAllUsers();
	
}
