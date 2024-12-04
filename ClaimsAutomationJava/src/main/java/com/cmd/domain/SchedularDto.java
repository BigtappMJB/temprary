package com.cmd.domain;

public class SchedularDto {
	private int tableId;
	private String tableName;
	private int schedulerNumber;
	
	public int getTableId() {
		return tableId;
	}
	public void setTableId(int tableId) {
		this.tableId = tableId;
	}
	public String getTableName() {
		return tableName;
	}
	public void setTableName(String tableName) {
		this.tableName = tableName;
	}
	public int getSchedulerNumber() {
		return schedulerNumber;
	}
	public void setSchedulerNumber(int schedulerNumber) {
		this.schedulerNumber = schedulerNumber;
	}
}
