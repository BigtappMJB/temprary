package com.cmd.excel.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.cmd.excel.model.IamUsers;
/**
 * @author ISV7915
 *
 */
public interface IamUserRepository extends JpaRepository<IamUsers, Integer> {

	@Query(value="select * from users usr where usr.user_name = :userName", nativeQuery=true) 
	IamUsers findUserByUserId(@Param("userName") String userName);
	
	IamUsers findUserById(int id);
	
	@Query(value="select count(*) FROM users usr where usr.user_name = :userName", nativeQuery=true) 
	int findByUserId(@Param("userName") String userName);
	
	@Query(value="select * from users usr  where usr.delete_flag = 0 ORDER BY id DESC ", nativeQuery=true) 
	List<IamUsers> getAllUsers();
	
}
