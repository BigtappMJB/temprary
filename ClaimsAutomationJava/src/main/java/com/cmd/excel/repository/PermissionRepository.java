package com.cmd.excel.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.cmd.excel.model.RolePermissions;

/**
 * @author ISV7915
 *
 */
public interface PermissionRepository  extends JpaRepository<RolePermissions, Long> {

	@Query(value = "SELECT * FROM rolepermissions rp WHERE rp.role_id = :roleId AND rp.table_id NOT IN (SELECT `table_id` FROM `dma_tables` WHERE `deleted_flag`=1)", nativeQuery = true)
	List<RolePermissions> findPermissionsByRoleId(@Param("roleId") int roleId);
	
	@Query(value = "SELECT * FROM rolepermissions rp WHERE rp.role_id = :roleId AND rp.permission_id !=6 AND rp.table_id NOT IN (SELECT `table_id` FROM `dma_tables` WHERE `deleted_flag`=1)", nativeQuery = true)
	List<RolePermissions> findPermissionsByRoleIdlogin(@Param("roleId") int roleId);
	
//	@Query(value = "select * from rolepermissions rp where rp.role_id = :roleId and rp.sub_module_id = :subModuleId", nativeQuery = true)
	@Query(value = "select * from rolepermissions rp, dma_tables dt  where rp.role_id = :roleId and rp.sub_module_id = :subModuleId and rp.table_id=dt.table_id ORDER BY dt.table_name", nativeQuery = true)
	List<RolePermissions> findPermissionsBySubmodule(@Param("roleId") int roleId, @Param("subModuleId") int subModuleId);

	@Query(value = "select count(*) from rolepermissions rp where rp.role_id=:roleId and rp.module_id=:moduleId and rp.sub_module_id = :subModuleId and rp.table_id=:tableId", nativeQuery = true)
	int findPermissioCount(@Param("roleId") int roleId, @Param("moduleId") int moduleId,
			@Param("subModuleId") int subModuleId, @Param("tableId") int tableId);
	
	@Query(value="select max(id) from rolepermissions", nativeQuery=true) 
	int findMaxId();
	
	@Query(value="select count(*) FROM rolepermissions WHERE role_id = :roleId AND sub_module_id =:subModuleId AND permission_id<>6", nativeQuery = true)
	int findCountOfSubModulesPermissions(@Param("roleId") int roleId, @Param("subModuleId") int subModuleId);


}
