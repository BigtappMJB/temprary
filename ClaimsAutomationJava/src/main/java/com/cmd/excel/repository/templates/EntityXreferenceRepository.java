package com.cmd.excel.repository.templates;


import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cmd.excel.model.embed.EntityXreferenceRequestEmbed;
import com.cmd.excel.model.templates.EntityXreference;

@Repository
public interface EntityXreferenceRepository extends JpaRepository<EntityXreference, EntityXreferenceRequestEmbed> {
	@Query(value = "select * from `entity_xreference` where SRC_RECORD_DELETE_IND = 'N' ORDER BY last_update_date_time DESC", nativeQuery = true)
	List<Map<String, Object>> getEntityXreferenceRepositoryRequest();

	@Query(value = "select * from `entity_xreference` where SRC_RECORD_DELETE_IND = 'Y'", nativeQuery = true)
	EntityXreference getEntityXreferenceRepositoryRequestDeleted();
	
	@Query(value = "select * from `entity_xreference` where ENTITY_ID= :columnValue  AND `SRC_RECORD_DELETE_IND` = 'N'", nativeQuery = true)
	List<String> getEntityXreferenceFk(@Param("columnValue") String columnValue);
	
}
