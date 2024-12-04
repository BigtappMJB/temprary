package com.cmd.excel.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.cmd.excel.model.CmdTable;

/**
 * @author ISV7915
 *
 */
public interface CmdTableRepository extends JpaRepository<CmdTable, Integer> {

	@Query(value = "select * from dma_tables dt where dt.sub_module_id = :submoduleId and dt.deleted_flag = 0", nativeQuery = true)
	List<CmdTable> getSubModuleTables(@Param("submoduleId") int submoduleId);

	@Query(value = "select * from dma_tables dt where dt.deleted_flag = 0", nativeQuery = true)
	List<CmdTable> getAllTables();

	@Query(value = "SELECT * FROM dma_tables dt WHERE dt.deleted_flag = 0 AND iscsvrequired=0 ORDER BY `dt`.`table_name` ASC", nativeQuery = true)
	List<CmdTable> getAllCsvTables();

	@Query(value = "select * from dma_tables dt where dt.table_id = :tableId and dt.deleted_flag = 0", nativeQuery = true)
	CmdTable getTableById(@Param("tableId") int tableId);

	@Query(value = "SELECT * FROM `dma_tables` WHERE deleted_flag=0 AND iscsvrequired=0 AND schedulernumber= :schedularValue OR schedulernumber= :schedularValue3", nativeQuery = true)
	List<CmdTable> getTableNameForCsv(@Param("schedularValue") int schedularValue,
			@Param("schedularValue3") int schedularValue3);

	@Query(value = "select * from `security_master_view` where SRC_RECORD_DELETE_IND = 'N' ORDER BY last_update_date_time DESC", nativeQuery = true)
	List<Map<String, Object>> getSecurityMasterView();

	@Query(value = "SELECT TABLE_COLUMN FROM `table_columns_order` where TABLE_NAME= :table_name ORDER BY COLUMN_ORDER ASC", nativeQuery = true)
	ArrayList<String> getTableOrder(@Param("table_name") String tableName);

	@Modifying
	@Transactional
	@Query(value = "TRUNCATE TABLE `adhoc_bloomberg_request`", nativeQuery = true)
	void truncateAdhocBloombergRequest();
}
