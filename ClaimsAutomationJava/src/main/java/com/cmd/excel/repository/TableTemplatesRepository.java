package com.cmd.excel.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.cmd.excel.model.TableTemplates;

/**
 * @author ISV7915
 *
 */
public interface TableTemplatesRepository extends JpaRepository<TableTemplates, Integer> {

	@Query(value = "select * from table_templates tt where tt.delete_flag = 0", nativeQuery = true)
	List<TableTemplates> getallTemplates();

	@Query(value = "select * from table_templates tt where tt.table_id = :tableId and tt.delete_flag = 0", nativeQuery = true)
	TableTemplates getTemplateByTableId(@Param("tableId") int tableId);

	@Query(value = "SELECT DISTINCT COLUMN_NAME FROM Information_schema.columns WHERE TABLE_NAME = :tableName AND COLUMN_NAME NOT  LIKE 'SRC_%' AND COLUMN_NAME NOT LIKE 'LAST_%'", nativeQuery = true)
	List<String> getTableColumns(@Param("tableName") String tableName);
	
}
