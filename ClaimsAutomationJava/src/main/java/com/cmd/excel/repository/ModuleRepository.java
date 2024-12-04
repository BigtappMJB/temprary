package com.cmd.excel.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.cmd.excel.model.CmdModule;

/**
 * @author ISV7915
 *
 */
public interface ModuleRepository extends JpaRepository<CmdModule, Integer> {
	
	@Query(value="select * from module module where module.module_id = :moduleId", nativeQuery=true) 
	CmdModule getModule(@Param("moduleId") int moduleId);
	
	@Query(value="select count(*) from module module where module.module_name = :moduleName", nativeQuery=true) 
	int moduleCount(@Param("moduleName") String moduleName);
}
