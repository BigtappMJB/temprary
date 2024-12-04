package com.cmd.excel.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.cmd.excel.model.Role;
/**
 * @author ISV7915
 *
 */
public interface RoleRepository extends JpaRepository<Role, Integer> {
	
	@Query(value="select * from role role where role.role_id = :roleId", nativeQuery=true) 
	Role getByRoleId(@Param("roleId") int roleId);
	
	@Query(value="select * from role role where role.role_name = :roleName", nativeQuery=true) 
	Role getByRoleName(@Param("roleName") String roleName);
	
	@Query(value="select count(*) from role role where role.role_name = :roleName", nativeQuery=true) 
	int findByRoleName(@Param("roleName") String roleName);
	
	@Query(value="select max(id) from role", nativeQuery=true) 
	int findMaxId();
	
	@Query(value="select * from Role role where role.id = :id", nativeQuery=true) 
	Role getById(@Param("id") int id);
	
	@Query(value="select * from role role where role.delete_flag = 0", nativeQuery=true) 
	List<Role> getAllRoles();

}
