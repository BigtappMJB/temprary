package com.cmd.excel.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.cmd.excel.model.TableTemplateDetails;

public interface TableTemplateDetailsRepository extends JpaRepository<TableTemplateDetails, Integer> {
	
	@Query(value="select count(*) from table_template_details where table_field_name =:tableFieldName and table_id = :tableId and template_id = :templateId", nativeQuery=true) 
	int checkTemplateDetailsExists(@Param("tableFieldName") String tableFieldName, @Param("tableId") int tableId, @Param("templateId") int templateId);
	
	@Query(value="select * from table_template_details where table_id = :tableId and template_id = :templateId", nativeQuery=true) 
	List<TableTemplateDetails> getTemplateDetails(@Param("tableId") int tableId, @Param("templateId") int templateId);
	
	@Query(value="select * from table_template_details where table_id = :tableId", nativeQuery=true) 
	List<TableTemplateDetails> getTemplateDetailsPrimaryKey(@Param("tableId") int tableId);
	
	@Query(value="select * from table_template_details where table_field_name =:tableFieldName and table_id = :tableId and template_id = :templateId", nativeQuery=true) 
	TableTemplateDetails getTableTemplateDetails(@Param("tableFieldName") String tableFieldName, @Param("tableId") int tableId, @Param("templateId") int templateId);
	
	@Query(value="select max(table_field_id) from table_template_details", nativeQuery=true) 
	int getMaxFieldId();
	
	@Query(value="select table_field_name from table_template_details where table_id=:tableId and is_primarykey = 'Y'", nativeQuery=true)
	List<String> getPrimaryKeyColumns(@Param("tableId") int tableId);
	
}
