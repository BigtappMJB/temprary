package com.cmd.excel.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.cmd.excel.model.PermissionValue;
/**
 * @author ISV7915
 *
 */
public interface PermissionValueRepository extends JpaRepository<PermissionValue, Integer> {
	
	@Query(value="select * from permission_value pv where pv.permission_value_id = :permissionValueId", nativeQuery=true) 
	PermissionValue getPermissionValueById(@Param("permissionValueId") int permissionValueId);
	
}
