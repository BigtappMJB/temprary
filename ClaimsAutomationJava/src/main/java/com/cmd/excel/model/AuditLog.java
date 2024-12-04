package com.cmd.excel.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "audit_log")
public class AuditLog {
	
	@Id
	@Column(name = "ID")
	private int id;
	
	@Column(name = "TABLE_NAME")
	private String tableName;

	@Column(name = "USER_ID")
	private String userId;

	@Column(name = "EVENT")
	private String event;

	@Column(name = "EVENT_DATE_TIME")
	private String eventDateTime;

	@Column(name = "SESSION_UUID")
	private String sessionUuid;

	@Column(name = "INSERT_COUNT")
	private int insertCount;

	@Column(name = "UPDATE_COUNT")
	private int updateCount;

	@Column(name = "DELETE_COUNT")
	private int deleteCount;
	
	@Column(name = "REFERENCE_VALUES")
	private String referenceValues;

	public AuditLog() {
		super();
	}

	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getEvent() {
		return event;
	}

	public void setEvent(String event) {
		this.event = event;
	}

	public String getEventDateTime() {
		return eventDateTime;
	}

	public void setEventDateTime(String eventDateTime) {
		this.eventDateTime = eventDateTime;
	}

	public String getSessionUuid() {
		return sessionUuid;
	}

	public void setSessionUuid(String sessionUuid) {
		this.sessionUuid = sessionUuid;
	}

	public int getInsertCount() {
		return insertCount;
	}

	public void setInsertCount(int insertCount) {
		this.insertCount = insertCount;
	}

	public int getUpdateCount() {
		return updateCount;
	}

	public void setUpdateCount(int updateCount) {
		this.updateCount = updateCount;
	}

	public int getDeleteCount() {
		return deleteCount;
	}

	public void setDeleteCount(int deleteCount) {
		this.deleteCount = deleteCount;
	}

	public String getReferenceValues() {
		return referenceValues;
	}

	public void setReferenceValues(String referenceValues) {
		this.referenceValues = referenceValues;
	}
}
