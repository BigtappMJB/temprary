package com.cmd.excel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.cmd.excel.model.AccessPermission;

/**
 * @author ISV7915
 *
 */
public interface AccessRepository extends JpaRepository<AccessPermission, Integer> {

	@Query(value = "select * from permission per where per.permission_id = :permissionId", nativeQuery = true)
	AccessPermission getAccessPermissionById(@Param("permissionId") int permissionId);

	@Query(value = "SELECT `status` FROM `csv_generation_status` WHERE `job_id`= :jobId", nativeQuery = true)
	String getCsv(@Param("jobId") int jobId);

	@Modifying
	@Transactional
	@Query(value = "UPDATE `csv_generation_status` SET `status` = :statusCode, `create_date` = NOW() WHERE `csv_generation_status`.`job_id` = :jobId", nativeQuery = true)
	void updateCsv(@Param("statusCode") int statusCode, @Param("jobId") int jobId);

}
