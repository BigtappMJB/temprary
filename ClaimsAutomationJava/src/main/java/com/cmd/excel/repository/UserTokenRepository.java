package com.cmd.excel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.cmd.excel.model.UserToken;
/**
 * @author ISV7915
 *
 */
public interface UserTokenRepository extends JpaRepository<UserToken, Integer> {

	@Query(value="select * from user_token ut where ut.user_name = :userName", nativeQuery=true) 
	UserToken findUserByUserId(@Param("userName") String userName);
	
	@Query(value="select count(*) FROM user_token ut where ut.user_name = :userName", nativeQuery=true) 
	int findByUserId(@Param("userName") String userName);
	
}
