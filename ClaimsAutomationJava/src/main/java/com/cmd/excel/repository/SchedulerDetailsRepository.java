package com.cmd.excel.repository;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.cmd.excel.model.SchedulerDetails;

@Repository
public interface SchedulerDetailsRepository extends JpaRepository<SchedulerDetails, Integer> {

	@Modifying
	@Transactional
	@Query(value="update scheduler_details set status=:status where id=:id", nativeQuery=true)
	int udpateStatus( @Param("id") int id,@Param("status") String status);
}

