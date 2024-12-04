package com.cmd.excel.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cmd.excel.model.SchedulerFileDetails;

@Repository
public interface SchedulerFileDetailsRepository extends JpaRepository<SchedulerFileDetails, Integer> {

	@Query(value = "select * from scheduler_File_details where scheduler_id=:schedulerId", nativeQuery = true)
	List<SchedulerFileDetails> findCSVFileNameBySchedulerId(@Param("schedulerId") int schedulerId);

}

