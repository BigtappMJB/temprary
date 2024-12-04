
/**
 * 	Date,			Author,		Description
 * 
 * 	2021-17-11,		ISV7915,	AuditLogService  class 
 * 								Initial version
 *  2021-22-11,		ISV7915,	Method level comments added
 */
package com.cmd.excel.service;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cmd.domain.response.Response;
import com.cmd.domain.response.UploadResponse;
import com.cmd.excel.model.AuditLog;
import com.cmd.excel.repository.AuditLogRepository;
import com.cmd.excel.utils.CmdUtils;

@Service
public class AuditLogService {

	@Autowired
	AuditLogRepository auditLogRepository;

	Response response = new Response();
	CmdUtils dmaUtils = new CmdUtils();

	/**
	 * For saving audit log
	 * 
	 * @param auditLog
	 */
	public void saveAuditLog(AuditLog auditLog) {
		auditLogRepository.save(auditLog);
	}

	/**
	 * For saving audit log for specific event
	 * 
	 * @param tableName
	 * @param userName
	 * @param operations
	 * @param uploadResponse
	 * @param userToken
	 */
	public void addLog(String tableName, String userName, Set<String> operations, UploadResponse uploadResponse,
			String userToken, String referenceValues) {
		AuditLog auditLog = new AuditLog();
		auditLog.setTableName(tableName);
		String event = String.join(", ", operations);
		auditLog.setEvent(event);
		auditLog.setEventDateTime(dmaUtils.getCurrentDateTime());
		auditLog.setUserId(userName);
		auditLog.setInsertCount(uploadResponse.getInsertedCount());
		auditLog.setUpdateCount(uploadResponse.getUpdatedCount());
		auditLog.setDeleteCount(uploadResponse.getDeletedCount());
		auditLog.setSessionUuid(userToken);
		auditLog.setReferenceValues(referenceValues);
		saveAuditLog(auditLog);
	}
	
	public void addLogCSV(String tableName, String referenceValues, int deleteCount) {
		AuditLog auditLog = new AuditLog();
		auditLog.setTableName(tableName);
		auditLog.setEvent("DEL");
		auditLog.setEventDateTime(dmaUtils.getCurrentDateTime());
		auditLog.setUserId("CSV Scheduler");
		auditLog.setInsertCount(0);
		auditLog.setUpdateCount(0);
		auditLog.setDeleteCount(deleteCount);
		auditLog.setSessionUuid("Backend Process");
		auditLog.setReferenceValues(referenceValues);
		saveAuditLog(auditLog);

	}
}
