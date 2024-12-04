package com.cmd.excel.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.cmd.excel.model.SubModule;
/**
 * @author ISV7915
 *
 */
public interface SubModuleRepository extends JpaRepository<SubModule, Integer> {
	
	@Query(value="select * from submodule sm where sm.sub_module_id = :submoduleId", nativeQuery=true) 
	SubModule getSubModule(@Param("submoduleId") int submoduleId);
	
	@Query(value="select count(*) from submodule sm where sm.sub_module_name = :subModuleName", nativeQuery=true) 
	int subModuleCount(@Param("subModuleName") String subModuleName);
	
	@Query(value="select * from submodule sm where sm.module_id = :moduleId", nativeQuery=true) 
	List<SubModule> getModuleSubModules(@Param("moduleId") int moduleId);
}
