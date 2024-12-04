package com.cmd.excel.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.cmd.excel.model.SchedularMaster;

public interface SchedularMasterRepository extends JpaRepository<SchedularMaster, Integer> {

	@Query(value="SELECT * FROM `scheduler_master`", nativeQuery=true)
	List<SchedularMaster> getSchedularMasterData();
}
