package com.cmd.excel.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cmd.excel.model.Tutorial;
/**
 * @author ISV7915
 *
 */
public interface TableRepository extends JpaRepository<Tutorial, Long> {
	
	
}
