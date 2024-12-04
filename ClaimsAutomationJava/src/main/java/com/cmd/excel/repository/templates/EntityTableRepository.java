package com.cmd.excel.repository.templates;

import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.cmd.excel.model.templates.EntityTable;

public interface EntityTableRepository extends JpaRepository<EntityTable, String> {
	@Query(value = "select * from entity where SRC_RECORD_DELETE_IND = 'N' ORDER BY last_update_date_time DESC", nativeQuery = true)
	List<Map<String, Object>> getEntityTableRepositoryRequest();

	@Query(value = "select * from entity where SRC_RECORD_DELETE_IND = 'Y'", nativeQuery = true)
	EntityTable getEntityTableRepositoryRequestDeleted();

	@Query(value = "SELECT * FROM `entity` WHERE MANAGER_CODE = :columnValue AND `SRC_RECORD_DELETE_IND` = 'N';", nativeQuery = true)
	List<String> getEntityFk(@Param("columnValue") String columnValue);
	
}
