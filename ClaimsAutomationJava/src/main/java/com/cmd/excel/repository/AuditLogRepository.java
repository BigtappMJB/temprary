package com.cmd.excel.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.cmd.excel.model.AuditLog;
/**
 * @author ISV7915
 *
 */
public interface AuditLogRepository extends JpaRepository<AuditLog, Integer> {
	
}
